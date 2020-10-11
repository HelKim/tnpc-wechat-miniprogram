import { db } from "@/api/wxc";
import { IPageParam } from "@/api";

export interface IEntryForm {
  _id: string;
  _openid: string;
  date: Date;
  name: string;
  type: string;
  value?: string;
  wrongDetail?: string;
  status: string;
}

export interface IRepairForm extends IEntryForm {
  acceptDate?: Date;
  assessment?: number;
  assessmentContent?: string;
  assessmentDate?: Date;
  avatarUrl?: string;
  dormitory: string;
  finishDate?: Date;
  fixType: string;
  personnel: string;
  phone: string;
  serviceType: string;
  wechat: string;
  wrongType: string;
  wrongDetail: string;
  value: string;
  cancelDate?: Date;
  closeDate?: Date;
}

export class RepairForm implements IRepairForm {
  _id = "";
  _openid = "";
  date = new Date();
  dormitory = "";
  fixType = "";
  name = "";
  personnel = "";
  phone = "";
  serviceType = "";
  type = EntryType.repair.toString();
  value = "";
  wechat = "";
  wrongDetail = "";
  wrongType = "";
  status = "已提交";
}

export enum EntryType {
  repair = "报修",
  register = "注册",
}

export const getUserRepairForms = async (page: IPageParam) => {
  const res = await db
    .collection("fixRecord")
    .limit(page.count)
    .skip(page.count * page.page)
    .orderBy("date", "desc")
    .get();
  return res.data as IRepairForm[];
};

export const getUserRepairCount = async () => {
  const res = await db.collection("fixRecord").count();
  return res.total;
};
