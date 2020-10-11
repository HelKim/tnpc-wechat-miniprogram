// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  if (event.id) {
    const res = await db.collection("fixRecord").doc(event.id).get();
    return res.data;
  } else if (event.type === "user" || event.type === "all") {
    const user = await getSuperUser(wxContext.OPENID);
    if (!user.isSuperUser) return [];
    const cond = {};
    if (event.type === "user") cond.value = user.data.name;

    if (event.filter.length === 0) return { total: 0, data: [] };
    const filter = [];
    if (event.filter.indexOf("unfinished") !== -1) {
      filter.push("已提交");
      filter.push("已接单");
    }
    if (event.filter.indexOf("finish") !== -1) {
      filter.push("已完成");
      filter.push("已评价");
      filter.push("已取消");
      filter.push("已关闭");
    }
    cond.status = _.in(filter);

    const res = db
      .collection("fixRecord")
      .where(cond)
      .orderBy("date", "desc")
      .limit(event.count)
      .skip(event.count * event.page)
      .get();
    const count = db.collection("fixRecord").where(cond).count();
    return { total: (await count).total, data: (await res).data };
  }
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
