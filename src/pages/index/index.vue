<template>
  <view class="index">
    <nav-bar
      title="首页"
      rid="index"
      @navClick="showCharts = !showCharts"
    ></nav-bar>
    <view class="recent">
      <menu-grid :all="false"></menu-grid>
    </view>
    <view class="charts" v-if="showCharts">
      <divide-title>报修数据</divide-title>
      <ring :show-data="repairData" :subtitle="repairData.total"></ring>
    </view>
    <view class="charts" v-if="showCharts">
      <divide-title>维修人员</divide-title>
      <repair-word :show-data="repairWord"></repair-word>
    </view>
    <view v-for="item in assess" :key="item._id">
      <assessment-card :assess="item"></assessment-card>
    </view>
    <view class="charts" v-if="contributors.show && showCharts">
      <divide-title>Contributors</divide-title>
      <contributors-word :show-data="contributors"></contributors-word>
    </view>
    <uni-popup ref="popup" type="dialog" @change="popupChange">
      <uni-popup-dialog
        :title="indexMsg.title"
        :content="indexMsg.content"
        :show-cancel="false"
        @confirm="confirm"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuGrid from "@/cpns/menu-grid/index.vue";
import DivideTitle from "@/cpns/divide-title/index.vue";
import Ring from "@/cpns/charts/ring.vue";
import RepairWord from "@/cpns/charts/repair-word.vue";
import UniPopup from "@/components/uni-popup/uni-popup.vue";
import UniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import AssessmentCard from "@/cpns/assessment-card/index.vue";
import ContributorsWord from "@/cpns/charts/contributors-word.vue";

import {
  getEveryFinish,
  getEveryScore,
  getRepairData,
  getRepairWord,
} from "@/api/statistic";
import {
  getContributors,
  getIndexMsg,
  IContributors,
  IIndexMsg,
} from "@/api/common";
import { getRandomAssess, IAssessment } from "@/api/assessment";

@Component({
  components: {
    MenuGrid,
    DivideTitle,
    Ring,
    RepairWord,
    UniPopup,
    UniPopupDialog,
    AssessmentCard,
    ContributorsWord,
  },
})
export default class Index extends Vue {
  private repairData = {} as {
    series: [{ name: string; data: number }];
    total: number;
  };
  private repairWord = {} as { series: [{ name: string; textSize: number }] };
  private indexMsg: IIndexMsg = {} as IIndexMsg;
  private assess: IAssessment[] = [];
  private contributors = { show: true } as IContributors;
  private showCharts = true;

  async created() {
    getRepairData().then((res) => (this.repairData = res));
    getRepairWord().then((res) => (this.repairWord = res));
    getRandomAssess().then((res) => (this.assess = res));
    getContributors().then((res) => (this.contributors = res));
  }

  mounted() {
    getIndexMsg().then((res) => {
      if (res) this.handleIndexMsg(res);
    });
  }

  handleIndexMsg(msg: IIndexMsg) {
    this.indexMsg = msg;
    if (!msg.show) return;
    const res = uni.getStorageSync("indexMsgValue");
    if (!msg.always && res === msg.value) return;
    uni.setStorageSync("indexMsgValue", msg.value);
    this.openIndexMsg();
  }

  openIndexMsg() {
    (this.$refs.popup as any).open();
  }

  confirm(e: () => void) {
    e();
  }

  popupChange(e: { show: any }) {
    this.showCharts = !e.show;
  }
}
</script>

<style scoped lang="scss">
.recent {
  padding: $uni-spacing-row-lg $uni-spacing-col-lg 0;
  background-color: #efefef;
}

/deep/ .divide-title {
  margin: 0 $uni-spacing-col-base;
}

.charts {
  border-radius: $uni-border-radius-base;
  overflow: hidden;
  margin: $uni-spacing-row-lg 0;
}
</style>
