import Rect = WechatMiniprogram.Rect;
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import { MenuMap, MenuRouter } from "@/router/menu-router";

export interface IAppState {
  // 状态栏的高度，单位px
  statusBar: number;
  // 菜单按钮（右上角胶囊按钮）的布局位置信息，坐标信息以屏幕左上角为原点。
  menuRect: Rect;
  // 导航栏高度（包括状态栏）
  navBarHeight: number;
  customBar: number;
  navState: string;
  recentMenu: MenuRouter[];
}

enum navMenuEnum {
  open = "arrowup",
  close = "arrowdown",
}

@Module({ dynamic: true, store, name: "app" })
class App extends VuexModule implements IAppState {
  public statusBar = 20;
  public menuRect = {} as Rect;
  public customBar = 30;
  public navState = "arrowdown";
  public navBarHeight = 0;
  public recentMenu: MenuRouter[] = [];

  @Mutation
  private SET_STATUS_BAR(s: number) {
    this.statusBar = s;
    this.navBarHeight = s + 44;
  }

  @Mutation
  private SET_MENU_RECT(m: Rect) {
    this.menuRect = m;
  }

  @Mutation
  private SET_CUSTOM_BAR(c: number) {
    this.customBar = c;
  }

  @Mutation
  private SET_NAV_STATE(n: string) {
    this.navState = n;
  }

  @Mutation
  public SET_RECENT_MENU(menu: MenuRouter) {
    const i = this.recentMenu.findIndex((item) => item.name === menu.name);
    if (i != -1) {
      this.recentMenu.splice(i, 1);
    } else {
      this.recentMenu.pop();
    }
    this.recentMenu.unshift(menu);
    uni.setStorageSync("recent-menu", this.recentMenu);
  }

  @Mutation
  public INIT_RECENT_MENU() {
    const menu = uni.getStorageSync("recent-menu");
    if (menu) {
      this.recentMenu = menu;
      return;
    }
    this.recentMenu = [
      MenuMap.get("free-fix")!,
      MenuMap.get("assessment")!,
      MenuMap.get("contactUs")!,
      MenuMap.get("register")!,
    ];
  }

  @Action
  public NavClick() {
    this.SET_NAV_STATE(
      this.navState === navMenuEnum.open ? navMenuEnum.close : navMenuEnum.open
    );
    return this.navState;
  }

  @Action
  public NavOpen() {
    this.SET_NAV_STATE(navMenuEnum.open);
  }

  @Action
  public NavClose() {
    this.SET_NAV_STATE(navMenuEnum.close);
  }

  @Action
  public async Init() {
    const statusBar = (await wx.getSystemInfo()).statusBarHeight;
    const menuRect = wx.getMenuButtonBoundingClientRect();
    this.SET_CUSTOM_BAR(menuRect.bottom + menuRect.top - statusBar);
    this.SET_STATUS_BAR(statusBar);
    this.SET_MENU_RECT(menuRect);
  }
}

export const AppModule = getModule(App);
