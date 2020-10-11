<template>
  <view class="assessment-submit">
    <nav-bar-simple title="填写评论"></nav-bar-simple>
    <divide-title class="underline">报修内容</divide-title>
    <text class="wrong-detail">{{ repairForm.wrongDetail }}</text>
    <view class="margin-top-lg">
      <divide-title class="underline">评价</divide-title>
    </view>
    <view class="rate">
      <uni-rate
        :value="assess.assessment / 2"
        size="16"
        @change="rateChange"
      ></uni-rate>
    </view>
    <textarea-item
      slot="formItem"
      v-model="assess.assessmentContent"
    ></textarea-item>
    <button
      class="cu-btn lg block bg-black"
      :disabled="disabled"
      @click="submit"
    >
      提交
    </button>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DivideTitle from "@/cpns/divide-title/index.vue";
import { IRepairForm } from "@/api/entry-form";
import { getRepairForm } from "@/api/free-fix";
import { IAssessment, postAssessment } from "@/api/assessment";
import UniRate from "@/components/uni-rate/uni-rate.vue";
import TextareaItem from "@/cpns/textarea-item/index.vue";

@Component({ components: { DivideTitle, UniRate, TextareaItem } })
export default class AssessmentSubmit extends Vue {
  private repairForm: IRepairForm = {} as IRepairForm;
  private disabled = false;
  private id: string = "id";
  private assess: IAssessment = {
    _id: "",
    _openid: "",
    name: "",
    value: "",
    assessmentDate: new Date(),
    assessmentContent: "",
    assessment: 2,
    vote: 0,
  };

  private async submit() {
    console.log(this.assess);
    if (!this.assess.assessmentContent.trim()) {
      await uni.showToast({ title: "请填写评价内容", duration: 2000 });
      return;
    }
    if (await postAssessment(this.assess)) {
      await uni.showModal({ content: "提交成功", showCancel: false });
      uni.navigateTo({ url: "/pages/index/index" });
    } else {
      await uni.showModal({ content: "提交失败", showCancel: false });
    }
  }

  onLoad(option: any) {
    if (option.id) {
      this.id = option.id;
      this.load();
    }
  }

  private async load() {
    this.repairForm = await getRepairForm(this.id);
    this.assess.name = this.repairForm.name;
    this.assess.value = this.repairForm.value;
    this.assess.fid = this.repairForm._id;
  }

  private rateChange(e: { value: number }) {
    this.assess.assessment = 2 * e.value;
  }
}
</script>

<style scoped lang="scss">
.wrong-detail {
  background-color: $uni-bg-color;
  font-size: $uni-font-size-base;
  padding: $uni-spacing-col-lg;
  display: block;
}
.rate {
  padding: 30rpx 20rpx;
  /*border-bottom: 1rpx solid #eee;*/
  background-color: $uni-bg-color;
}
.cu-btn {
  margin: 30rpx 20rpx;
  background-color: black;
}
</style>
