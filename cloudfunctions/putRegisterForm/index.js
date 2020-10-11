// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  if (!(await getSuperUser(wxContext.OPENID)).isSuperUser) return false;
  await db
    .collection("register")
    .doc(event.form._id)
    .update({
      data: {
        status: event.type === "accept" ? "已通过" : "已结束",
        updateDate: new Date(),
      },
    });
  if (event.type === "reject") return true;

  const res = await db
    .collection("superUser")
    .where({
      _openid: event.form._openid,
    })
    .update({
      data: {
        name: event.form.name,
        position: event.form.position,
        department: event.form.department,
        email: event.form.email,
        updateDate: new Date(),
      },
    });
  if (res.updated === 0) {
    await db.collection("superUser").add({
      data: {
        _openid: event.form._openid,
        name: event.form.name,
        position: event.form.position,
        department: event.form.department,
        email: event.form.email,
        date: new Date(),
      },
    });
  }
  return true;
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
