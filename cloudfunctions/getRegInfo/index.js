// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const res = await db
    .collection("superUser")
    .where({
      _openid: wxContext.OPENID,
    })
    .get();
  const userInfo = {
    _openid: wxContext.OPENID,
    department: "",
    level: 0,
    name: "",
    position: "普通用户",
  };
  if (res.length === 0) {
    return userInfo;
  }
  userInfo.name = res.data[0].name;
  userInfo.department = res.data[0].department;
  userInfo.level = res.data[0].level;
  userInfo.position = res.data[0].position;
  cloud.logger().info(userInfo);
  return userInfo;
};
