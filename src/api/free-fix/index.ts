import wxc, { cloud, db } from "@/api/wxc";
import { IRepairForm, RepairForm } from "@/api/entry-form";
import { IPageParam } from "@/api";

export interface IPersonnel {
  name: string;
  value: string;
  count: number;
}

export enum FixStatus {
  submit = "已提交",
  accept = "已接单",
  finish = "已完成",
  close = "已关闭",
  cancel = "已取消",
  assess = "已评价",
}

export const getPersonnel = async () => {
  const res = await db.collection("selectPerson").where({ state: true }).get();
  if (res.data.length === 0) {
    return [];
  }
  return res.data[0].personnel as IPersonnel[];
};

export const postRepairForm = async (form: RepairForm) => {
  const res = await wxc.call("postRepairForm", { form });
  return res.result;
};

export const getRepairForm = async (id: string) => {
  const res = await wxc.call("getRepairForm", { id });
  return res.result as IRepairForm;
};

export const putRepairForm = async (type: string, form: IRepairForm) => {
  const res = await wxc.call("putRepairForm", { type, form });
  return res.result;
};

export const listRepairForm = async (
  type: string,
  page: IPageParam,
  filter: string[]
) => {
  const res = await wxc.call("getRepairForm", {
    type,
    page: page.page,
    count: page.count,
    filter,
  });
  return res.result as { data: IRepairForm[]; total: number };
};
