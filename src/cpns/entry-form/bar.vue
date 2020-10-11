<template>
  <view class="entry-form-bar">
    <s-tabs active-color="black" line-color="black" @changeValue="change">
      <s-tab title="报修" value="userRepair" v-if="showUserRepair"></s-tab>
      <s-tab title="报单" value="repair" v-if="isSuperUser"></s-tab>
      <s-tab title="报名" value="apply"></s-tab>
    </s-tabs>
    <uni-icons
      type="gear"
      size="20"
      class="filter"
      @click="iconClick"
    ></uni-icons>
    <uni-popup ref="popup" type="category" @change="popupChange">
      <category-select :lists="cb_data" v-model="categories"></category-select>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import sTabs from "@/components/s-tabs/index.vue";
import sTab from "@/components/s-tab/index.vue";
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import UniPopup from "@/components/uni-popup/uni-popup.vue";
import CategorySelect from "@/components/uni-popup/category-select.vue";
import RadioData from "@/cpns/radio-item/radio-data";
import { UserModule } from "@/store/modules/user";

@Component({ components: { CategorySelect, UniIcons, sTabs, sTab, UniPopup } })
export default class EntryFormBar extends Vue {
  @Prop({ default: true })
  private showUserRepair!: boolean;
  @Prop({ default: [] })
  private category!: string[];
  private categories: string[] = [];
  private hasChanged = false;

  @Watch("categories")
  private onCategoriesChange(newV: string[]) {
    this.$emit("update:category", newV);
    this.hasChanged = true;
  }

  get isSuperUser() {
    return UserModule.isSuperUser;
  }

  private cb_data: RadioData[] = [
    { name: "未完成", value: "unfinished", checked: true },
    { name: "已完成", value: "finish", checked: false },
  ];

  private change(value: string) {
    this.$emit("change", value);
  }

  private popupChange(e: { show: boolean }) {
    this.$emit("popupChange", { show: e.show, changed: this.hasChanged });
  }

  private iconClick() {
    this.hasChanged = false;
    (this.$refs.popup as any).open();
  }

  mounted() {
    this.$emit("update:category", this.categories);
  }
}
</script>

<style scoped lang="scss">
.entry-form-bar {
  display: flex;
  align-items: center;
  background-color: $uni-bg-color-grey;

  .filter {
    margin-left: auto;
    margin-right: 10px;
  }
}
</style>
