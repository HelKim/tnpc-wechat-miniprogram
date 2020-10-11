<template>
  <view class="statistics-page">
    <nav-bar-simple title="数据统计"></nav-bar-simple>
    <divide-title>维修单数</divide-title>
    <uni-list>
      <uni-list-item
        v-for="(item, index) in everyFinish"
        :title="index + 1 + '.' + item.name"
        :right-text="item.num"
        :key="index"
      ></uni-list-item>
    </uni-list>
    <view class="margin-top-lg">
      <divide-title>个人评分</divide-title>
      <uni-list>
        <uni-list-item
          v-for="(item, index) in everyScore"
          :title="index + 1 + '.' + item.name"
          :right-text="item.score.toFixed(2)"
          :key="index"
        ></uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DivideTitle from "@/cpns/divide-title/index.vue";
import UniList from "../../components/uni-list/uni-list.vue";
import UniListItem from "../../components/uni-list-item/uni-list-item.vue";
import { getEveryFinish, getEveryScore } from "../../api/statistic";

@Component({
  components: {
    UniListItem,
    UniList,
    DivideTitle,
  },
})
export default class Statistics extends Vue {
  private everyFinish = {} as [{ name: string; num: number }];
  private everyScore = {} as [{ name: string; score: number }];

  created() {
    getEveryFinish().then((res) => {
      res.sort((a, b) => {
        return b.num - a.num;
      });
      this.everyFinish = res;
    });
    getEveryScore().then((res) => {
      res.sort((a, b) => b.score - a.score);
      this.everyScore = res;
    });
  }
}
</script>

<style scoped lang="scss"></style>
