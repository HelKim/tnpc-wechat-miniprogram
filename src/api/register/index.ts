import wxc, { db } from "@/api/wxc";
import { EntryType } from "@/api/entry-form";

export class RegisterForm {
  _id = "";
  _openid = "";
  name = "";
  email = "";
  department = "";
  position = "";
  date = new Date();
  updateDate?: Date;
  type = EntryType.register.toString();
  status = "已提交";
}

export const postRegisterForm = async (form: RegisterForm) => {
  delete form._id;
  delete form._openid;
  form.date = new Date();
  const res = await db.collection("register").add({ data: { ...form } });
  return res._id;
};

export const getRegisterForm = async (id: string) => {
  const res = await wxc.call("getRegisterForm", { id });
  return res.result as RegisterForm;
};

export const putRegisterForm = async (type: string, form: RegisterForm) => {
  const res = await wxc.call("putRegisterForm", { type, form });
  return res.result;
};
