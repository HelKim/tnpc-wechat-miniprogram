<template>
  <view class="entry-management">
    <nav-bar-simple title="报单管理"></nav-bar-simple>
    <view class="bar" :style="{ top: navHeight + 'px' }">
      <entry-form-bar
        :show-user-repair="false"
        @change="tab = $event"
        @popupChange="onPopupChange"
        :category.sync="dataFilter"
      ></entry-form-bar>
    </view>
    <entry-from-content :list="listData"></entry-from-content>
    <pagination
      :current.sync="currentPage"
      :total="totalSize"
      :page-size="pageSize"
    ></pagination>
  </view>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import PaginationMixin from "@/cpns/pagination";
import EntryFormBar from "@/cpns/entry-form/bar.vue";
import EntryFromContent from "@/cpns/entry-form/content.vue";
import { AppModule } from "@/store/modules/app";
import { IEntryForm } from "@/api/entry-form";
import Pagination from "@/cpns/pagination/index.vue";
import { IPageParam } from "@/api";
import { listRepairForm } from "@/api/free-fix";
import { listApplies } from "@/api/apply";

@Component({ components: { EntryFormBar, EntryFromContent, Pagination } })
export default class EntryManagement extends mixins(PaginationMixin) {
  private listData: IEntryForm[] = [];
  private tab = "repair";
  private dataFilter = [];

  get navHeight() {
    return AppModule.navBarHeight;
  }

  @Watch("currentPage")
  private async loadData() {
    const page: IPageParam = {
      page: this.currentPage - 1,
      count: this.pageSize,
    };
    if (this.tab === "repair") {
      const res = await listRepairForm("all", page, this.dataFilter);
      this.listData = res.data;
      this.totalSize = res.total;
    } else if (this.tab === "apply") {
      const res = await listApplies("all", page, this.dataFilter);
      this.listData = res.data;
      this.totalSize = res.total;
    }
    uni.pageScrollTo({ scrollTop: 0, duration: 200 });
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

  private mounted() {
    this.loadData();
  }
}
</script>

<style scoped lang="scss">
.entry-management {
  .bar {
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
