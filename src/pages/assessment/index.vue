<template>
  <view class="assessment">
    <nav-bar-simple title="用户说"></nav-bar-simple>
    <view>
      <assessment-card
        v-for="(item, index) in assessList"
        :assess="item"
        :key="index"
      ></assessment-card>
    </view>
    <pagination
      :current.sync="currentPage"
      :page-size="pageSize"
      :total="totalSize"
    ></pagination>
  </view>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import PaginationMixin from "@/cpns/pagination";
import AssessmentCard from "@/cpns/assessment-card/index.vue";
import {
  countAssessments,
  getAssessments,
  IAssessment,
} from "@/api/assessment";
import Pagination from "@/cpns/pagination/index.vue";

@Component({ components: { AssessmentCard, Pagination } })
export default class Assessment extends mixins(PaginationMixin) {
  private assessList: IAssessment[] = [];

  private created() {
    this.loadData();
  }

  @Watch("currentPage")
  private async loadData() {
    const res = getAssessments({
      page: this.currentPage - 1,
      count: this.pageSize,
    });
    this.totalSize = await countAssessments();
    this.assessList = await res;
    console.log(this.assessList);
    uni.pageScrollTo({ scrollTop: 0, duration: 300 });
  }
}
</script>

<style scoped lang="scss">
/deep/ .pagination {
  margin: 30rpx 0;
}
</style>
