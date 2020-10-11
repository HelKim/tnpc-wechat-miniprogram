import wxc from "@/api/wxc";

export const getOneFinish = async () => {
  const res = await wxc.call("statistics", { type: "oneFinish" });
  return (res.result as unknown) as number;
};

export const getAllFinish = async () => {
  const res = await wxc.call("statistics", { type: "allFinish" });
  return (res.result as unknown) as number;
};

export const getAllUnfinished = async () => {
  return ((await wxc.call("statistics", { type: "allUnfinished" }))
    .result as unknown) as number;
};

export const getEveryFinish = async () => {
  return (await wxc.call("statistics", { type: "everyFinish" })).result as [
    { name: string; num: number }
  ];
};

export const getEveryScore = async () => {
  return (await wxc.call("statistics", { type: "everyScore" })).result as [
    { name: string; score: number }
  ];
};

export const getOneScore = async () => {
  const res = (await wxc.call("statistics", { type: "oneScore" })).result as [
    { name: string; score: number }
  ];
  return res[0]?.score;
};

export const getRepairData = async () => {
  return (await wxc.call("statistics", { type: "repairData" })).result as {
    series: [{ name: string; data: number }];
    total: number;
  };
};

export const getRepairWord = async () => {
  return (await wxc.call("statistics", { type: "repairWord" })).result as {
    series: [{ name: string; textSize: number }];
  };
};
