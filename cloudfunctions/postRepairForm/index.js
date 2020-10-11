// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
const openid = cloud.getWXContext().OPENID;
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const form = event.form;
  delete form._id;
  form._openid = wxContext.OPENID;
  form.date = new Date();
  try {
    const r = await db
      .collection("selectPerson")
      .where({
        state: true,
        personnel: _.elemMatch({
          count: _.gt(0),
          value: form.value,
        }),
      })
      .update({
        data: {
          "personnel.$.count": _.inc(-1),
        },
      });
    console.log(r);
    if (r.stats.updated === 0) return false;

    const res = db.collection("fixRecord").add({ data: form });
    sendSubmitMsg(form);
    cloud.callFunction({
      name: "mail",
      data: {
        type: "sendSubMsg",
        form,
      },
    });
    await res;
    return true;
  } catch (e) {
    cloud.logger().error({ e });
    return false;
  }
};

async function sendSubmitMsg(form) {
  try {
    const r = await db
      .collection("superUser")
      .where({
        name: form.value,
      })
      .get();
    if (r.data.length === 0) return;

    const res = cloud.openapi.subscribeMessage.send({
      touser: r.data[0]._openid,
      page: "pages/home/index",
      data: {
        thing3: {
          value: form.name,
        },
        phone_number9: {
          value: form.phone,
        },
        thing6: {
          value: form.wrongDetail,
        },
        name8: {
          value: form.value,
        },
      },
      templateId: "EBY8Vs4rhIKKzyen3r1IVB0JFInorNGYYRuw11NMBhA",
    });

    await db
      .collection("subMsg")
      .where({
        name: form.value,
        count: _.gt(0),
      })
      .update({
        data: {
          count: _.inc(-1),
        },
      });

    await res;
    return true;
  } catch (e) {
    cloud.logger().error({ e });
  }
}
