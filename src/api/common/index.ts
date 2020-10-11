import { db } from "@/api/wxc";
import { UserModule } from "@/store/modules/user";

const _ = db.command;

export const getSubMsgCount = async () => {
  const res = await db.collection("subMsg").get();
  return res.data.length > 0 ? res.data[0].count : 0;
};

export const addSubMsg = async () => {
  const res = await wx.requestSubscribeMessage({
    tmplIds: ["EBY8Vs4rhIKKzyen3r1IVB0JFInorNGYYRuw11NMBhA"],
  });
  // @ts-ignore
  if (res["EBY8Vs4rhIKKzyen3r1IVB0JFInorNGYYRuw11NMBhA"] !== "accept") {
    uni.showToast({ title: "添加失败", icon: "none" });
    return false;
  }
  const r = await db
    .collection("subMsg")
    .where({
      _openid: UserModule._openid,
    })
    // @ts-ignore
    .update({
      data: {
        count: _.inc(1),
      },
    });
  if (r.stats.updated === 0) {
    await db.collection("subMsg").add({
      data: {
        count: 1,
        name: UserModule.name,
      },
    });
  }
  uni.showToast({ title: "添加成功", icon: "none" });
  return true;
};

export const requestFreeFixMsg = async () => {
  const res = await wx.requestSubscribeMessage({
    tmplIds: ["De66q-dPrpYY4RXISx6qSQDmqFmSQJoMQ4ecL0RaOuI"],
  });
  // @ts-ignore
  return res["De66q-dPrpYY4RXISx6qSQDmqFmSQJoMQ4ecL0RaOuI"] === "accept";
};

export interface IIndexMsg {
  _id: string;
  always: boolean;
  content: string;
  show: boolean;
  title: string;
  type: string;
  value: string;
}

export const getIndexMsg = async () => {
  const res = await db
    .collection("config")
    .where({
      type: "indexMsg",
    })
    .get();
  if (res.data.length === 0) return false;
  return res.data[0] as IIndexMsg;
};

export interface IContributors {
  _id: string;
  show: boolean;
  series: [{ name: string; textSize: number }];
}

export const getContributors = async () => {
  const res = await db
    .collection("config")
    .where({
      type: "contributors",
    })
    .get();
  if (res.data.length === 0) return { show: false } as IContributors;
  return res.data[0] as IContributors;
};
