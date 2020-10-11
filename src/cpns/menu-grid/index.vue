<!--suppress CssInvalidPropertyValue -->
<template>
  <view class="menu-grid">
    <view class="recent">
      <view class="title"
        >最近访问{{ all ? "" : "(点击左上角标题查看菜单)" }}</view
      >
      <uni-grid
        :column="4"
        :show-border="false"
        :square="false"
        @change="clickItemRecent"
      >
        <uni-grid-item
          v-for="(item, idx) in recentMenu"
          :key="item.path"
          :index="idx"
        >
          <image :src="item.logoSrc" class="logo" v-if="item.logoSrc"></image>
          <view v-else class="logo text">
            <text class="center">{{ item.name.charAt(0) }}</text>
          </view>
          <text class="name">{{ item.name }}</text>
        </uni-grid-item>
      </uni-grid>
    </view>

    <view class="all" v-if="all">
      <view class="title">全部功能</view>
      <uni-grid
        :column="4"
        :show-border="false"
        :square="false"
        @change="clickItem"
      >
        <uni-grid-item
          v-for="(item, idx) in menuList"
          :key="item.path"
          :index="idx"
        >
          <image :src="item.logoSrc" class="logo" v-if="item.logoSrc"></image>
          <view v-else class="logo text">
            <text class="center">{{ item.name.charAt(0) }}</text>
          </view>
          <text class="name">{{ item.name }}</text>
        </uni-grid-item>
      </uni-grid>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import uniGrid from "@/components/uni-grid/uni-grid.vue";
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue";
import { MenuList, MenuRouter } from "@/router/menu-router";
import { UserModule } from "@/store/modules/user";
import { AppModule } from "@/store/modules/app";

@Component({ components: { uniGrid, uniGridItem } })
export default class MenuGrid extends Vue {
  @Prop({ default: true })
  private all!: boolean;

  get menuList() {
    return MenuList.filter((menu) => this.mFilter(menu));
  }

  get recentMenu() {
    return AppModule.recentMenu.filter((menu) => this.mFilter(menu));
  }

  private mFilter(menu: MenuRouter): boolean {
    if (menu.access === "all") return true;
    else if (menu.access === "superUser") return UserModule.isSuperUser;
    else if (menu.access === "manager") return UserModule.isManager;
    return false;
  }

  private clickItem(e: { detail: { index: number } }) {
    this.goRouter(this.menuList[e.detail.index]);
  }

  private clickItemRecent(e: { detail: { index: number } }) {
    this.goRouter(this.recentMenu[e.detail.index]);
  }

  private goRouter(item: MenuRouter) {
    AppModule.SET_RECENT_MENU(item);
    uni[item.route]({ url: item.path });
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.name {
  font-size: $uni-font-size-base;
  text-align: center;
  margin-bottom: 50rpx;
  margin-top: 20rpx;
  overflow: hidden;
}

.logo {
  text-align: center;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
}

.text {
  background-color: $uni-bg-color;
  display: flex;
  align-items: center;
  align-content: center;
}

.center {
  margin: 0 auto;
}

.title {
  font-size: $uni-font-size-base;
  margin: 0 $uni-spacing-col-base;
  margin-bottom: $uni-spacing-row-lg;
  color: $uni-text-color-grey;
}
</style>
