<template>
  <view class="nav-bar">
    <uni-nav-bar
      fixed
      status-bar
      :border="false"
      @clickLeft="onClick"
      background-color="#f1f1f1"
      :left-btn-style="'width:400rpx'"
    >
      <view slot="left" class="content">
        <image class="logo margin-right" :src="logoSrc"></image>
        <text class="margin-right title">{{ title }}</text>
        <uni-icons :type="arrow" class="margin-right"></uni-icons>
      </view>
    </uni-nav-bar>
    <popup-layer
      ref="popup"
      direction="top"
      full-screen
      :nav-bar="false"
      backgroud-color="#f1f1f1"
    >
      <menu-page></menu-page>
    </popup-layer>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import { AppModule } from "@/store/modules/app";
import { MenuMap } from "@/router/menu-router";
import MenuPage from "@/pages/menu-page/index.vue";
import popupLayer from "@/components/popup-layer/popup-layer.vue";

@Component({ components: { uniNavBar, uniIcons, MenuPage, popupLayer } })
export default class NavBar extends Vue {
  @Prop({ required: true, default: "" })
  private title!: string;
  @Prop({ required: true })
  private rid!: string;

  get arrow() {
    return AppModule.navState;
  }

  get height() {
    return AppModule.menuRect.height + 5;
  }

  get logoSrc() {
    return MenuMap.get(this.rid)?.logoSrc;
  }

  private async onClick() {
    this.$emit("navClick");
    const arrow = await AppModule.NavClick();
    if (arrow === "arrowup") {
      (this.$refs.popup as any).show();
    } else {
      (this.$refs.popup as any).close();
    }
  }

  beforeDestroy() {
    AppModule.NavClose();
  }
}
</script>

<style scoped lang="scss">
.nav-bar {
  z-index: 9999;

  .content {
    display: flex;
    align-items: center;
  }

  .logo {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    overflow: hidden;
  }

  .title {
    font-size: $uni-font-size-lg;
    color: black;
  }
}

.margin-right {
  margin-right: 5px;
}
</style>
