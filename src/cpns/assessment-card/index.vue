<template>
  <view class="assessment-card">
    <view class="rate">
      <uni-rate :value="form.assessment / 2" size="16" disabled></uni-rate>
    </view>
    <view class="content">
      {{ form.assessmentContent }}
      <view class="font-base">@{{ form.value }}</view>
    </view>
    <view class="footer">
      <view @click="clickVote">
        <uni-icons type="hand-thumbsup"></uni-icons>
        <text class="font-base">{{ form.vote }}</text>
      </view>
      <view class="time">{{ formatter(form.assessmentDate) }}</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UniRate from "@/components/uni-rate/uni-rate.vue";
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import { assessmentVote, IAssessment } from "@/api/assessment";
import moment from "moment";

@Component({
  components: { UniIcons, UniRate },
})
export default class AssessmentCard extends Vue {
  @Prop({ required: true })
  private assess!: IAssessment;

  private form = this.assess;
  @Watch("assess")
  private assessChange(newV: IAssessment) {
    this.form = newV;
  }

  private formatter(date: Date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
  private async clickVote() {
    this.form.vote++;
    if (await assessmentVote(this.assess)) {
      uni.showToast({ title: "点赞成功", icon: "none" });
    } else {
      uni.showToast({ title: "已点赞过了", icon: "none" });
      this.form.vote--;
    }
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.assessment-card {
  margin: $uni-spacing-row-lg $uni-spacing-col-base;
  background-color: $uni-bg-color;
  border-radius: $uni-border-radius-base;
  padding: $uni-spacing-row-lg $uni-spacing-col-base;
}

.rate {
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.content {
  font-size: $uni-font-size-base;
  margin: 0 5rpx;
}

.footer {
  display: flex;
  align-items: center;
  align-content: center;
  margin-top: 40rpx;
}

.time {
  font-size: $uni-font-size-base;
  color: $uni-text-color-grey;
  margin-left: auto;
  margin-right: 5rpx;
}
</style>
