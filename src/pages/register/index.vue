<template>
  <view class="register">
    <nav-bar-simple title="用户认证"></nav-bar-simple>
    <evan-form :model="form" :rules="rules" ref="form">
      <divide-title class="underline">个人信息</divide-title>
      <evan-form-item prop="name">
        <input-item slot="formItem" red_dot title="姓名" class="underline">
          <input v-model="form.name" />
        </input-item>
      </evan-form-item>
      <evan-form-item prop="email">
        <input-item slot="formItem" red_dot title="邮箱">
          <input v-model="form.email" />
        </input-item>
      </evan-form-item>

      <divide-title class="underline margin-top">部门</divide-title>
      <evan-form-item prop="department">
        <radio-item
          :check-value.sync="form.department"
          :radio-items="departmentRadio"
          slot="formItem"
        ></radio-item>
      </evan-form-item>

      <divide-title class="underline margin-top">职位</divide-title>
      <evan-form-item prop="position">
        <radio-item
          :check-value.sync="form.position"
          :radio-items="positionRadio"
          slot="formItem"
        ></radio-item>
      </evan-form-item>
    </evan-form>

    <button
      class="cu-btn lg block bg-black"
      open-type="getUserInfo"
      @getuserinfo="submit"
      :disabled="disabled"
    >
      提交
    </button>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DivideTitle from "@/cpns/divide-title/index.vue";
import EvanForm from "@/components/evan-form/evan-form.vue";
import EvanFormItem from "@/components/evan-form-item/evan-form-item.vue";
import { postRegisterForm, RegisterForm } from "@/api/register";
import InputItem from "@/cpns/input-item/index.vue";
import RadioItem from "@/cpns/radio-item/index.vue";
import RadioData from "@/cpns/radio-item/radio-data";
import { getUserInfo } from "@/utils/utils";

@Component({
  components: { DivideTitle, EvanForm, EvanFormItem, InputItem, RadioItem },
})
export default class Register extends Vue {
  private form = new RegisterForm();
  private rules = {
    name: [{ required: true, message: "请输入名称" }],
    email: [{ required: true, message: "情书邮箱" }],
  };
  private positionRadio: RadioData[] = [
    { name: "干事", value: "干事", checked: true },
    { name: "部长", value: "部长", checked: false },
    { name: "会长", value: "会长", checked: false },
    { name: "会员", value: "会员", checked: false },
  ];
  private departmentRadio: RadioData[] = [
    { name: "技术部", value: "技术部", checked: true },
    { name: "网络部", value: "网络部", checked: false },
    { name: "概设部", value: "概设部", checked: false },
    { name: "策划部", value: "策秘部", checked: false },
  ];
  private disabled = false;

  private async submit() {
    this.disabled = true;
    await getUserInfo();
    (this.$refs.form as any).validate((b: boolean) => {
      if (b) {
        this.submit_();
      }
    });
    this.disabled = false;
  }

  private async submit_() {
    if (await postRegisterForm(this.form)) {
      await uni.showModal({ content: "提交成功", showCancel: false });
      uni.navigateBack();
    } else {
      await uni.showModal({
        content: "提交失败，请联系管理员",
        showCancel: false,
      });
    }
  }
}
</script>

<style scoped lang="scss">
.margin-top {
  /deep/ .divide-title {
    margin-top: $uni-spacing-row-lg;
  }
}

.cu-btn {
  margin: 30rpx 20rpx;
  background-color: black;
}
</style>
