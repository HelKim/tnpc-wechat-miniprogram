<!--suppress CssInvalidPropertyValue -->
<template>
  <view class="input-item form-group">
    <view class="title"
      >{{ title }}
      <text class="red-dot" v-if="red_dot">*</text>
    </view>
    <view class="form-group-input">
      <slot />
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class InputItem extends Vue {
  @Prop()
  private title!: string;
  @Prop({ default: false })
  private red_dot!: boolean;
}
</script>

<style scoped lang="scss">
// @formatter:off
.form-group {
  background-color: #fff;
  padding: 1rpx 30rpx;
  display: flex;
  align-items: center;
  min-height: 100rpx;
  justify-content: space-between;
}

.form-group .title {
  text-align: justify;
  padding-right: 30rpx;
  font-size: 30rpx;
  position: relative;
  height: 60rpx;
  line-height: 60rpx;
}

.form-group-input {
  flex: 1;
  font-size: 30rpx;
  color: #555;
  padding-right: 20rpx;
}

.red-dot {
  font-size: 30rpx;
  color: red;
}
</style>
