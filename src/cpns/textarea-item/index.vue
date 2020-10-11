<template>
  <view class="textarea-item">
    <textarea
      :value="value"
      @input="handleInput"
      @linechange="handleLineChange"
      class="area"
      maxlength="-1"
      :style="{ height: height + 'rpx' }"
    ></textarea>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TextareaItem extends Vue {
  @Prop({ default: "" })
  private value!: string;

  private height = 150;

  private handleInput(e: { detail: { value: string; cursor: any } }) {
    this.$emit("input", e.detail.value);
  }

  private handleLineChange(e: { detail: { heightRpx: number } }) {
    if (e.detail.heightRpx > this.height) {
      this.height = e.detail.heightRpx;
    }
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.textarea-item {
  background-color: $uni-bg-color;

  .area {
    font-size: 30rpx;
    padding: 30rpx;
    width: 100%;
    height: 150rpx;
  }
}
</style>
