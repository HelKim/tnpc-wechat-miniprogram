// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "163",
  port: 465,
  secureConnection: true,
  auth: {
    user: "",
    pass: "",
  },
});

const mailOptions = {
  from: "塔内PC小程序 <clowntom@163.com>",
  to: "123@example.com, 234@example.com",
  subject: "【塔内PC小程序】", // Subject line
  // 发送text或者html格式
  // text: 'Hello world?', // plain text body
  html: "<p></p>", // html body
  // cc: "1223@example.com,1234@example.com"
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  if (event.type === "sendSubMsg") {
    return await sendSubMsg(event.form);
  }
};

async function sendSubMsg(form) {
  try {
    const res = await db
      .collection("superUser")
      .where({
        name: form.value,
      })
      .get();
    if (res.data.length === 0) return false;

    mailOptions.to = res.data[0].email;
    mailOptions.subject = `【塔内PC小程序】${form.name}需要您的帮助`;
    mailOptions.html = `<p>${form.wrongDetail}</p>`;

    return await transporter.sendMail(mailOptions);
  } catch (e) {
    cloud.logger().error({ e });
    return e;
  }
}
