<template>
  <view class="menu-grid">
    <view class="m-grid">
      <menu-grid></menu-grid>
    </view>
    <uni-list background_color="#f8f8f8">
      <uni-list-item
        title="我的主页"
        show-arrow
        @click="homePageClick"
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuGrid from "@/cpns/menu-grid/index.vue";
import uniList from "@/components/uni-list/uni-list.vue";
import uniListItem from "@/components/uni-list-item/uni-list-item.vue";

@Component({ components: { MenuGrid, uniList, uniListItem } })
export default class MenuPage extends Vue {
  private homePageClick() {
    uni.reLaunch({ url: "/pages/home/index" });
  }
}
</script>

<style scoped lang="scss">
.menu-grid {
  padding-top: 10px;
  background-color: $uni-bg-color-grey;

  .m-grid {
    width: calc(100% - 50rpx);
    margin: 0 auto;
    padding: 0 25rpx;
  }

  .title {
    font-size: $uni-font-size-base;
    color: $uni-text-color-grey;
    margin: 30rpx;
  }
}
</style>
