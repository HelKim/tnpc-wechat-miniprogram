export interface MenuRouter {
  path: string;
  name: string;
  logoSrc: string;
  route: routeEnum;
  access: "all" | "superUser" | "manager";
}

enum routeEnum {
  navigateTo = "navigateTo",
  redirect = "redirectTo",
  reLaunch = "reLaunch",
  navigateBack = "navigateBack",
}

export const MenuMap = new Map<string, MenuRouter>([
  [
    "index",
    {
      path: "/pages/index/index",
      name: "首页",
      logoSrc:
        "cloud://xenvironment-25da7d.7865-xenvironment-25da7d-1257646232/assets/logo.jpg",
      route: routeEnum.reLaunch,
      access: "all",
    },
  ],
  [
    "entry-management",
    {
      path: "/pages/entry-management/index",
      name: "报单管理",
      logoSrc: "",
      route: routeEnum.navigateTo,
      access: "superUser",
    },
  ],
  [
    "free-fix",
    {
      path: "/pages/free-fix/index",
      name: "免费报修",
      logoSrc: "",
      route: routeEnum.navigateTo,
      access: "all",
    },
  ],
  [
    "assessment",
    {
      path: "/pages/assessment/index",
      name: "用户说",
      logoSrc: "",
      route: routeEnum.navigateTo,
      access: "all",
    },
  ],
  [
    "register",
    {
      path: "/pages/register/index",
      name: "用户认证",
      logoSrc: "",
      route: routeEnum.navigateTo,
      access: "all",
    },
  ],
  [
    "contactUs",
    {
      path: "/pages/contact-us/index",
      name: "联系我们",
      logoSrc: "",
      route: routeEnum.navigateTo,
      access: "all",
    },
  ],
  [
    "statistics-page",
    {
      path: "/pages/statistics-page/index",
      name: "数据统计",
      logoSrc: "",
      route: routeEnum.navigateTo,
      access: "all",
    },
  ],
]);

export const MenuList = [...MenuMap.values()];
