<!--suppress CssInvalidPropertyValue -->
<template>
  <view class="qiun-charts ring">
    <canvas
      canvas-id="canvasRing"
      id="canvasRing"
      class="charts"
      @touchstart="touchRing"
    ></canvas>
  </view>
</template>

<script>
import uCharts from "@/components/u-charts/u-charts.js";

let _self;
let canvaRing = null;

export default {
  data() {
    return {
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
    };
  },
  props: {
    showData: {
      type: Object,
    },
    title: {
      type: String,
      default: "总数",
    },
    subtitle: {
      type: String,
      default: "",
    },
  },
  watch: {
    showData(newV) {
      this.showRing("canvasRing", this.showData);
    },
  },

  created() {
    _self = this;
    this.cWidth = uni.upx2px(718);
    this.cHeight = uni.upx2px(500);
    if (this.showData.series) {
      this.showRing("canvasRing", this.showData);
    }
  },

  methods: {
    showRing(canvasId, chartData) {
      canvaRing = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "ring",
        fontSize: 11,
        padding: [5, 5, 5, 5],
        legend: {
          show: true,
          position: "right",
          float: "center",
          itemGap: 10,
          padding: 5,
          lineHeight: 26,
          margin: 5,
          //backgroundColor:'rgba(41,198,90,0.2)',
          //borderColor :'rgba(41,198,90,0.5)',
          borderWidth: 1,
        },
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        disablePieStroke: true,
        dataLabel: true,
        subtitle: {
          name: this.subtitle,
          color: "#7cb5ec",
          fontSize: 20 * _self.pixelRatio,
        },
        title: {
          name: this.title,
          color: "#666666",
          fontSize: 15 * _self.pixelRatio,
        },
        extra: {
          pie: {
            offsetAngle: 0,
            ringWidth: 40 * _self.pixelRatio,
            labelWidth: 15,
          },
        },
      });
    },
    touchRing(e) {
      canvaRing.touchLegend(e, {
        animation: true,
      });
      canvaRing.showToolTip(e, {
        format: function (item) {
          return item.name + ":" + item.data;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
// @formatter:off
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
