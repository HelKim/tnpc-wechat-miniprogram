// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const form = event.form;

  if (event.type === "add") {
    delete form._id;
    form._openid = wxContext.OPENID;
    form.date = form.assessmentDate = new Date();
    const r1 = await db.collection("comment").add({
      data: {
        ...form,
        votes: [],
      },
    });
    if (r1._id) {
      await db
        .collection("fixRecord")
        .doc(form.fid)
        .update({
          data: {
            assessmentDate: form.date,
            assessmentContent: form.assessmentContent,
            assessment: form.assessment,
            status: "已评价",
          },
        });
    } else return false;
  } else if (event.type === "vote") {
    const res = await db
      .collection("comment")
      .where({
        _id: form._id,
        votes: _.all([wxContext.OPENID]),
      })
      .get();
    if (res.data.length !== 0) return false;
    await db
      .collection("comment")
      .doc(form._id)
      .update({
        data: {
          vote: _.inc(1),
          votes: _.push([wxContext.OPENID]),
        },
      });
  }
  return true;
};
