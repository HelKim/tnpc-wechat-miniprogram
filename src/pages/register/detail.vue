<template>
  <view class="register-detail">
    <nav-bar-simple title="认证信息"></nav-bar-simple>
    <divide-title class="underline">申请信息</divide-title>
    <uni-list>
      <uni-list-item title="姓名" :right-text="form.name"></uni-list-item>
      <uni-list-item title="邮箱" :right-text="form.email"></uni-list-item>
      <uni-list-item title="部门" :right-text="form.department"></uni-list-item>
      <uni-list-item title="职位" :right-text="form.position"></uni-list-item>
      <uni-list-item title="状态" :right-text="form.status"></uni-list-item>
      <uni-list-item
        title="时间"
        :right-text="formatter(form.date)"
      ></uni-list-item>
      <uni-list-item
        v-if="form.updateDate"
        title="处理时间"
        :right-text="formatter(form.updateDate)"
      ></uni-list-item>
    </uni-list>
    <view class="btns" v-if="form.status === '已提交'">
      <button
        class="cu-btn lg block bg-black"
        :disabled="disabled"
        @click="onClick('reject')"
      >
        拒绝
      </button>
      <button
        class="cu-btn lg block bg-black"
        :disabled="disabled"
        @click="onClick('accept')"
      >
        通过
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getRegisterForm, putRegisterForm, RegisterForm } from "@/api/register";
import DivideTitle from "@/cpns/divide-title/index.vue";
import UniList from "@/components/uni-list/uni-list.vue";
import UniListItem from "@/components/uni-list-item/uni-list-item.vue";
import moment from "moment";

@Component({ components: { UniListItem, UniList, DivideTitle } })
export default class RegisterDetail extends Vue {
  private form: RegisterForm = new RegisterForm();
  private id = "";
  private disabled = false;

  onLoad(option: any) {
    if (option.id) {
      this.id = option.id;
      this.load();
    }
  }

  private async load() {
    this.form = await getRegisterForm(this.id);
  }

  private formatter(date: Date) {
    return moment(date).format("YYYY-MM-DD hh:mm:ss");
  }

  private async onClick(type: string) {
    this.disabled = true;
    if (await putRegisterForm(type, this.form)) {
      uni.showToast({ title: "操作成功" });
      uni.navigateBack();
    } else {
      uni.showToast({ title: "操作失败" });
    }
    this.disabled = false;
  }
}
</script>

<style scoped lang="scss">
.btns {
  display: flex;
  margin: 30rpx 20rpx;
}

.cu-btn {
  margin: 0 10rpx;
  flex-grow: 1;
  background-color: black;
}
</style>
