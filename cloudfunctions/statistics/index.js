// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
let openid = "";
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  openid = wxContext.OPENID;

  if (event.type === "oneFinish") {
    return await oneFinish();
  } else if (event.type === "allFinish") {
    return await allFinish();
  } else if (event.type === "allUnfinished") {
    return await allUnfinished();
  } else if (event.type === "everyFinish") {
    return await everyFinish();
  } else if (event.type === "everyScore") {
    return await everyScore();
  } else if (event.type === "oneScore") {
    return await oneScore();
  } else if (event.type === "repairData") {
    return await repairData();
  } else if (event.type === "repairWord") {
    return await repairWord();
  }
  return "no this function";
};

async function repairWord() {
  const res = await everyFinish();
  const score = res.map((r) => r.num);
  score.sort((a, b) => a - b);
  const result = { series: [] };
  res.forEach((r) => {
    result.series.push({
      name: r.name,
      textSize: Math.ceil(
        rangeMap(10, 30, score[0], score[score.length - 1], r.num)
      ),
    });
  });
  return result;
}

function rangeMap(out_start, out_end, in_start, in_end, input) {
  return (
    out_start +
    ((input - in_start) / (in_end - in_start)) * (out_end - out_start)
  );
}

async function repairData() {
  const res = await db
    .collection("fixRecord")
    .aggregate()
    .group({
      _id: "$status",
      num: $.sum(1),
    })
    .end();
  let fr = 0,
    ur = 0,
    cr = 0;
  res.list.forEach((l) => {
    if (l._id === "已完成" || l._id === "已评价") {
      fr += l.num;
    } else if (l._id === "已关闭" || l._id === "已取消") {
      cr += l.num;
    } else {
      ur += l.num;
    }
  });
  return {
    series: [
      { name: "已完成", data: fr },
      { name: "维修中", data: ur },
      { name: "已取消", data: cr },
    ],
    total: fr + ur + cr,
  };
}

async function oneScore() {
  const user = await getSuperUser();
  if (!user.isSuperUser) return 0;
  const res = await db
    .collection("comment")
    .aggregate()
    .match({
      value: user.data.name,
    })
    .project({
      name: "$value",
      score: $.avg("$assessment"),
    })
    .end();
  return res.list;
}

async function everyScore() {
  const res = await db
    .collection("comment")
    .aggregate()
    .group({
      _id: "$value",
      score: $.avg("$assessment"),
    })
    .project({
      _id: 0,
      name: "$_id",
      score: 1,
    })
    .limit(100)
    .end();
  return res.list;
}

async function everyFinish() {
  const res = await db
    .collection("fixRecord")
    .aggregate()
    .match({
      status: _.in(["已完成", "已评价"]),
    })
    .group({
      _id: "$value",
      num: $.sum(1),
    })
    .project({
      _id: 0,
      name: "$_id",
      num: 1,
    })
    .limit(100)
    .end();
  return res.list;
}

async function allUnfinished() {
  const res = await db
    .collection("fixRecord")
    .where({
      status: _.in(["已提交", "已接单"]),
    })
    .count();
  return res.total;
}

async function allCancel() {
  const res = await db
    .collection("fixRecord")
    .where({
      status: _.in(["已关闭", "已取消"]),
    })
    .count();
  return res.total;
}

async function allFinish() {
  return (
    await db
      .collection("fixRecord")
      .where({
        status: _.in(["已完成", "已评价"]),
      })
      .count()
  ).total;
}

async function oneFinish() {
  const user = await getSuperUser();
  if (!user.isSuperUser) return 0;
  const res = await db
    .collection("fixRecord")
    .where({
      value: user.data.name,
      status: _.in(["已完成", "已评价"]),
    })
    .count();
  return res.total;
}

async function getSuperUser() {
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
