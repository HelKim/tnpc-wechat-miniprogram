<!--suppress CssInvalidPropertyValue -->
<template>
  <view class="home">
    <nav-bar title="首页" rid="index"></nav-bar>
    <view class="head-title">
      <view class="userinfo-avatar">
        <open-data type="userAvatarUrl"></open-data>
      </view>
      <view class="user-name clearfix">
        <open-data type="userNickName"></open-data>
        <view class="position">{{ position }} | {{ department }}</view>
      </view>
      <view class="item"
        >报修<text class="value">{{ statistics.userRepair }}</text></view
      >
      <view class="item" v-if="isSuperUser"
        >报单<text class="value">{{ statistics.repair }}</text></view
      >
      <view class="item" @click="clickEnergy" v-if="isSuperUser"
        >能量<text class="value">{{ statistics.energy }}</text></view
      >
      <view class="item" v-if="isSuperUser"
        >评分<text class="value">{{ statistics.score }}</text></view
      >
    </view>
    <view class="content" :style="{ top: navHeight + 'px' }">
      <entry-form-bar
        class="bar"
        @change="tab = $event"
        @popupChange="onPopupChange"
        :category.sync="dataFilter"
      ></entry-form-bar>
    </view>
    <view>
      <entry-from-content :list="listData"></entry-from-content>
    </view>
    <view>
      <pagination
        :current="currentPage"
        :total="totalSize"
        :page-size="pageSize"
      ></pagination>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import EntryFormBar from "@/cpns/entry-form/bar.vue";
import EntryFromContent from "@/cpns/entry-form/content.vue";
import { AppModule } from "@/store/modules/app";
import {
  getUserRepairCount,
  getUserRepairForms,
  IEntryForm,
} from "@/api/entry-form";
import PaginationMixin from "@/cpns/pagination";
import { mixins } from "vue-class-component";
import Pagination from "@/cpns/pagination/index.vue";
import { UserModule } from "@/store/modules/user";
import { listRepairForm } from "@/api/free-fix";
import { listApplies } from "@/api/apply";
import { IPageParam } from "@/api";
import { getOneFinish, getOneScore } from "@/api/statistic";
import { addSubMsg, getSubMsgCount } from "@/api/common";

@Component({ components: { EntryFormBar, EntryFromContent, Pagination } })
export default class Home extends mixins(PaginationMixin) {
  private tab = "userRepair";
  private dataFilter = [];
  private statistics = {
    userRepair: 0,
    repair: 0,
    energy: 0,
    score: 0,
  };

  get navHeight() {
    return AppModule.navBarHeight;
  }

  get position() {
    return UserModule.position;
  }

  get department() {
    return UserModule.department;
  }

  get isSuperUser() {
    return UserModule.isSuperUser;
  }

  private listData: IEntryForm[] = [];

  private async loadData() {
    const page: IPageParam = {
      page: this.currentPage - 1,
      count: this.pageSize,
    };
    if (this.tab === "userRepair") {
      const list = getUserRepairForms(page);
      this.totalSize = await getUserRepairCount();
      this.listData = await list;
      this.statistics.userRepair = this.totalSize;
    } else if (this.tab === "repair") {
      const res = await listRepairForm("user", page, this.dataFilter);
      this.listData = res.data;
      this.totalSize = res.total;
    } else if (this.tab === "apply") {
      const res = await listApplies("user", page, this.dataFilter);
      this.listData = res.data;
      this.totalSize = res.total;
    }
  }

  @Watch("tab")
  private onTabChange() {
    this.resetPage();
    this.loadData();
  }

  private onPopupChange(e: { show: boolean; changed: boolean }) {
    if (!e.show && e.changed) {
      this.onTabChange();
    }
  }

  mounted() {
    this.loadData();
  }

  async created() {
    const r1 = getOneFinish();
    const r2 = getOneScore();
    const r3 = getSubMsgCount();
    this.statistics.repair = await r1;
    this.statistics.score = (await r2) || 0;
    this.statistics.energy = await r3;
  }

  async clickEnergy() {
    this.statistics.energy++;
    await addSubMsg();
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.home {
  .head-title {
    background-color: $uni-bg-color;
    margin: 7px;
    padding: 20rpx 24rpx;
    border-radius: 3px;

    .item {
      margin: 10px 0;
      font-size: $uni-font-size-base;

      .value {
        margin-left: 200rpx;
      }
    }
  }

  .userinfo-avatar {
    width: 100rpx;
    height: 100rpx;
    overflow: hidden;
    border-radius: 10%;
    float: left;
    margin-right: 10px;
  }

  .position {
    margin: 10rpx;
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .content {
    margin-top: 15px;
    position: sticky;
    z-index: 10;
  }
}

/deep/ .entry-form-content {
  position: relative;
  z-index: 1;
}

/deep/ .pagination {
  margin-bottom: $uni-spacing-row-lg;
}
</style>
