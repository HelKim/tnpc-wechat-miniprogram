// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  if (
    event.type !== "user" &&
    !(await getSuperUser(wxContext.OPENID)).isSuperUser
  ) {
    return [];
  }
  const cond = {};
  if (event.type === "user") {
    cond._openid = wxContext.OPENID;
  }

  if (event.filter.length === 0) return { total: 0, data: [] };
  const regFilter = [];
  if (event.filter.indexOf("unfinished") !== -1) {
    regFilter.push("已提交");
  }
  if (event.filter.indexOf("finish") !== -1) {
    regFilter.push("已通过");
    regFilter.push("已结束");
  }
  cond.status = _.in(regFilter);

  const register = db
    .collection("register")
    .where(cond)
    .limit(event.count)
    .skip(event.count * event.page)
    .get();
  const regCount = await db.collection("register").where(cond).count();
  const regRes = await register;
  return { total: regCount.total, data: regRes.data };
};

async function getSuperUser(openid) {
  const res = await db
    .collection("superUser")
    .where({
      _openid: openid,
    })
    .get();
  if (res.data.length !== 0 && res.data[0].level >= 3) {
    return { isSuperUser: true, data: res.data[0] };
  } else {
    return { isSuperUser: false };
  }
}
