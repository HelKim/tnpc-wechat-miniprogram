import { IPageParam } from "@/api";
import wxc, { db } from "@/api/wxc";
import * as _ from "lodash";

export interface IAssessment {
  _id: string;
  _openid: string;
  assessment: number;
  assessmentDate: Date;
  assessmentContent: string;
  name: string;
  value: string;
  vote: number;
  fid?: string;
}

export const getAssessments = async (page: IPageParam) => {
  const res = await db
    .collection("comment")
    .orderBy("assessmentDate", "desc")
    .skip(page.count * page.page)
    .limit(page.count)
    .get();
  return res.data as IAssessment[];
};

export const countAssessments = async () => {
  const res = await db.collection("comment").count();
  return res.total;
};

export const postAssessment = async (form: IAssessment) => {
  const res = await wxc.call("putAssessment", { form, type: "add" });
  return res.result;
};

export const assessmentVote = async (form: IAssessment) => {
  const res = await wxc.call("putAssessment", { form, type: "vote" });
  return res.result;
};

export const getRandomAssess = async () => {
  const count = await countAssessments();
  const page = Math.floor(count / 10);
  const p = _.random(0, page - 1 > 0 ? page - 1 : 0, false);

  return await getAssessments({ page: p, count: 10 });
};
