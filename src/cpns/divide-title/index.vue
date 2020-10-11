<template>
  <view class="divide-title">
    <view class="icon-titles" />
    <text class="title">
      <slot></slot>
    </text>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DivideTitle extends Vue {
  @Prop()
  private title!: string;
}
</script>

<style scoped lang="scss">
// @formatter:off
.divide-title {
  background-color: $uni-bg-color;
  display: flex;
  align-items: center;
  padding: 30rpx;
}

.icon-titles {
  background-color: black;
  width: 15rpx;
  height: 15rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.title {
  margin-left: 5px;
  font-size: 30rpx;
}
</style>
