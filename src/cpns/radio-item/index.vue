<template>
  <view class="radio-item">
    <radio-group>
      <view
        v-for="(item, index) in items"
        :key="item.value"
        class="form-group border-line"
        @click="radioChange(index)"
      >
        <view class="title">{{ item.name }} </view>
        <radio
          :value="item.value"
          :checked="item.checked"
          color="black"
        ></radio>
      </view>
    </radio-group>
  </view>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from "vue-property-decorator";
import RadioData from "@/cpns/radio-item/radio-data";

@Component
export default class RadioItem extends Vue {
  @Prop({ default: [] })
  private radioItems!: RadioData[];
  @Prop({ default: "" })
  private checkValue!: string;
  @Prop({ required: false, default: 0 })
  private checkPosition!: number;

  private items: RadioData[] = this.radioItems;
  private position = this.checkPosition;

  @Watch("radioItems")
  private onRadioItemsChange(newV: RadioData[]) {
    this.items = newV;
    this.init();
  }
  @Watch("checkPosition")
  private onCheckPositionChange(newV: number) {
    this.position = newV;
  }

  public radioChange(index: number) {
    this.items[this.position].checked = false;
    this.position = index;
    this.items[index].checked = true;
    this.$emit("update:checkValue", this.items[index].value);
  }

  private init() {
    if (this.radioItems.length > this.position) {
      this.radioChange(this.position);
    }
  }

  created() {
    this.init();
  }
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

.border-line {
  border-bottom: 1rpx solid #eee;
}
</style>
