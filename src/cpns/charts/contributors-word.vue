<template>
  <view class="word qiun-charts">
    <canvas
      canvas-id="contributors-word"
      id="contributors-word"
      class="charts"
      @touchstart="touchWord"
    ></canvas>
  </view>
</template>

<script>
import uCharts from "@/components/u-charts/u-charts.js";

let _self;
let canvaWord = null;

export default {
  data() {
    return {
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      textarea: "",
    };
  },
  props: {
    showData: {
      type: Object,
      default: {},
    },
    id: {
      type: String,
      default: "canvasWord",
    },
  },
  created() {
    _self = this;
    this.cWidth = uni.upx2px(718);
    this.cHeight = uni.upx2px(500);
    if (this.showData.series) this.showWord("contributors-word", this.showData);
  },
  watch: {
    showData() {
      this.showWord("contributors-word", this.showData);
    },
  },
  methods: {
    showWord(canvasId, chartData) {
      canvaWord = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "word",
        background: "#ffffff",
        animation: true,
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          word: {
            type: "normal",
          },
        },
      });
    },
    touchWord(e) {
      canvaWord.showToolTip(e, {
        format: function (item) {
          return item.name;
        },
      });
    },
  },
};
</script>

<style scoped>
/* @formatter:off */
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts {
  width: 718upx;
  height: 500upx;
  background-color: #ffffff;
  margin: 0 auto;
}

.charts {
  width: 718upx;
  height: 500upx;
  background-color: #ffffff;
}
</style>
