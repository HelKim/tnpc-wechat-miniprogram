import wxc from "@/api/wxc";
import { IEntryForm } from "@/api/entry-form";
import { IPageParam } from "@/api";

export const listApplies = async (
  type: string,
  page: IPageParam,
  filter: string[]
) => {
  const res = await wxc.call("getApplies", {
    type,
    page: page.page,
    count: page.count,
    filter,
  });
  return res.result as { data: IEntryForm[]; total: number };
};
