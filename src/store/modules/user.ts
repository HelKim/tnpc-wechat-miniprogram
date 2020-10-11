import {
  Module,
  VuexModule,
  Mutation,
  getModule,
  Action,
} from "vuex-module-decorators";
import store from "@/store";
import { getRegInfo } from "@/api/user";

export interface IUserState {
  _openid: string;
  name: string;
  level: number;
  department: string;
  position: string;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public _openid = "";
  public name = "";
  public level = 0;
  public department = "";
  public position = "普通用户";

  @Mutation
  private SET_OPENID(openId: string) {
    this._openid = openId;
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name;
  }

  @Mutation
  private SET_LEVEL(level: number) {
    this.level = level;
  }

  @Mutation
  private SET_DEPARTMENT(department: string) {
    this.department = department;
  }

  @Mutation
  private SET_POSITION(position: string) {
    this.position = position;
  }

  @Mutation
  private SET_USER(user: IUserState) {
    this.position = user.position;
    this.department = user.department;
    this.level = user.level;
    this.name = user.name;
    this._openid = user._openid;
  }

  @Action
  public async Login() {
    const user = await getRegInfo();
    this.SET_USER(user);
  }

  public get isSuperUser() {
    return this.level >= 3;
  }

  public get isManager() {
    return this.level >= 4;
  }
}

export const UserModule = getModule(User);
