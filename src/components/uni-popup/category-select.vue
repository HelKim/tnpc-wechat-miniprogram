<template>
  <view class="category-select">
    <uni-icons type="closeempty" class="close" @click="close"></uni-icons>
    <view class="title">数据筛选</view>
    <checkbox-group class="cbox" @change="change">
      <label v-for="(item, index) in lists" :key="index">
        <checkbox
          :value="item.value"
          :checked="item.checked"
          class="cb-item"
          color="black"
          >{{ item.name }}</checkbox
        >
      </label>
    </checkbox-group>
  </view>
</template>

<script lang="ts">
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import { Inject, Vue, Component, Prop } from "vue-property-decorator";
import RadioData from "@/cpns/radio-item/radio-data";

@Component({ components: { UniIcons } })
export default class CategorySelect extends Vue {
  @Inject() readonly popup!: string;
  @Prop({ default: [] })
  private lists!: RadioData[];
  @Prop({ default: [] })
  private value!: string[];

  private change(e: { detail: { value: any } }) {
    this.$emit("input", e.detail.value);
  }

  created() {
    this.$emit(
      "input",
      this.lists.filter((item) => item.checked).map((item) => item.value)
    );
  }

  private close() {
    (this.popup as any).close();
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.category-select {
  background-color: $uni-bg-color;
  height: 250rpx;
  display: flex;
  align-items: center;
}
.close {
  top: 0;
  right: 0;
  position: absolute;
}
.cb-item {
  transform: scale(0.8);
}
.title {
  position: absolute;
  top: 10rpx;
  left: 20rpx;
  font-size: $uni-font-size-lg;
}
</style>
