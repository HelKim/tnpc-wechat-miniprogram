<template>
  <view class="nav-bar-simple">
    <uni-nav-bar
      :title="title"
      left-icon="arrowleft"
      status-bar
      fixed
      :border="false"
      background-color="#f1f1f1"
      @clickLeft="clickLeft"
      class="bar"
    ></uni-nav-bar>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";

@Component({
  components: { UniNavBar },
})
export default class NavBarSimple extends Vue {
  @Prop({ default: "" })
  private title!: string;

  private clickLeft() {
    uni.navigateBack();
  }
}
</script>

<style scoped lang="scss"></style>
