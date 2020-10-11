<template>
  <view class="contact-us">
    <view class="content">
      <nav-bar-simple title="联系我们"></nav-bar-simple>
      <button class="cu-btn lg block bg-black" open-type="contact">
        在线客服
      </button>
      <button class="cu-btn lg block bg-black" open-type="feedback">
        问题反馈
      </button>
    </view>
    <view class="footer">v2.0.1</view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ContactUs extends Vue {}
</script>

<style scoped lang="scss">
.cu-btn {
  margin: 30rpx 20rpx;
  background-color: black;
}
.footer {
  font-size: $uni-font-size-sm;
  color: $uni-text-color-grey;
  text-align: center;
}
.content {
  min-height: calc(100vh - 70px);
}
</style>
