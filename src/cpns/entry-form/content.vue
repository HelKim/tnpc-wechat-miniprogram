<template>
  <view class="entry-form-content">
    <uni-card
      v-for="item in list"
      :key="item._id"
      :title="item.name"
      :extra="getExtra(item)"
      @click="onClick(item)"
    >
      <view
        v-if="item.type === EntryType.repair || item.wrongDetail"
        class="card-content"
        >{{ item.wrongDetail }}</view
      >
      <view v-if="item.type === EntryType.register" class="card-content">{{
        item.department + "," + item.position
      }}</view>
      <view v-if="item.value" class="font-base">@{{ item.value }}</view>
      <view class="card-time">{{ formatter(item.date) }}</view>
    </uni-card>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import uniCard from "@/components/uni-card/uni-card.vue";
import { EntryType, IEntryForm, IRepairForm } from "@/api/entry-form";
import moment from "moment";

@Component({ components: { uniCard } })
export default class EntryFromContent extends Vue {
  @Prop({ default: [] })
  private list!: IEntryForm[];
  private EntryType = EntryType;

  private formatter(date: Date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }

  private getExtra(item: IEntryForm) {
    return `${item.type} | ${item.status}`;
  }

  private onClick(item: IEntryForm) {
    if (item.type === EntryType.repair || (item as any).fixType) {
      uni.navigateTo({ url: `/pages/repair-form-page/index?id=${item._id}` });
    } else if (item.type === EntryType.register) {
      uni.navigateTo({ url: `/pages/register/detail?id=${item._id}` });
    }
    console.log(item);
  }
}
</script>

<style scoped lang="scss">
.entry-form-content {
  .card-content {
    font-size: $uni-font-size-base;
  }

  .card-time {
    font-size: $uni-font-size-base;
    color: $uni-text-color-grey;
    margin-top: 3px;
    text-align: right;
  }
}
</style>
