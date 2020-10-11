import wxc from "@/api/wxc";
import { IUserState } from "@/store/modules/user";

export const getRegInfo = async () => {
  const res = await wxc.call("getRegInfo");
  return res.result as IUserState;
};
