// 云函数入口文件
const moment = require("moment");
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();

// 云函数入口函数
const openid = cloud.getWXContext().OPENID;
exports.main = async (event, context) => {
  if (
    event.type === "已接单" ||
    event.type === "已完成" ||
    event.type === "已关闭" ||
    event.type === "已取消"
  ) {
    let dateName = "acceptDate";
    if (event.type === "已完成") dateName = "finishDate";
    else if (event.type === "已关闭") dateName = "closeDate";
    else if (event.type === "已取消") dateName = "cancelDate";

    if (event.type === "已完成") {
      sendFinishMsg(event.form);
    }

    const res = await db
      .collection("fixRecord")
      .doc(event.form._id)
      .update({
        data: {
          status: event.type,
          [dateName]: new Date(),
        },
      });

    return res.stats.updated;
  }
  return 0;
};

async function sendFinishMsg(form) {
  try {
    const res = await cloud.openapi.subscribeMessage.send({
      touser: form._openid,
      page: "pages/home/index",
      data: {
        character_string12: {
          value: form._id,
        },
        thing15: {
          value: form.name,
        },
        date9: {
          value: moment().utcOffset(480).format("YYYY-MM-DD HH:mm:ss"),
        },
        thing10: {
          value: form.personnel,
        },
        thing6: {
          value: "非常渴望你的评价，烦请点击评价！",
        },
      },
      templateId: "De66q-dPrpYY4RXISx6qSQDmqFmSQJoMQ4ecL0RaOuI",
    });
    return true;
  } catch (e) {
    cloud.logger().error({ e });
    return false;
  }
}
