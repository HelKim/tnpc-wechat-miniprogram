<template>
  <view class="pagination">
    <view class="margin-top-lg margin-bottom-lg">
      <uni-pagination
        show-icon
        :current="current"
        :page-size="pageSize"
        :total="total"
        @change="change"
        v-if="total > 0"
      ></uni-pagination>
    </view>
    <view class="text" v-if="total === 0">暂无数据</view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UniPagination from "@/components/uni-pagination/uni-pagination.vue";

@Component({
  components: { UniPagination },
})
export default class Pagination extends Vue {
  @Prop({ default: 1 })
  public current!: number;
  @Prop({ default: 0 })
  public total!: number;
  @Prop({ default: 10 })
  public pageSize!: number;

  private change(e: { type: string; current: number }) {
    this.$emit("change", e);
    this.$emit("update:current", e.current);
  }
}
</script>

<style scoped lang="scss">
.text {
  font-size: $uni-font-size-base;
  text-align: center;
  margin: $uni-spacing-row-lg;
}
</style>
