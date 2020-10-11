<!--suppress CssInvalidPropertyValue -->
<template>
  <view class="free-fix">
    <nav-bar-simple title="免费报修"></nav-bar-simple>
    <evan-form :rules="rules" :model="formData" ref="form">
      <divide-title class="underline">联系信息</divide-title>
      <evan-form-item prop="name">
        <input-item title="姓名" red_dot class="underline" slot="formItem">
          <input placeholder="请输入姓名" v-model="formData.name" />
        </input-item>
      </evan-form-item>
      <evan-form-item prop="phone">
        <input-item title="手机" red_dot class="underline" slot="formItem">
          <input
            placeholder="请输入手机号码"
            type="number"
            v-model="formData.phone"
          />
        </input-item>
      </evan-form-item>
      <evan-form-item prop="wechat">
        <input-item title="微信" red_dot class="underline" slot="formItem">
          <input placeholder="请输入微信" v-model="formData.wechat" />
        </input-item>
      </evan-form-item>
      <evan-form-item prop="dormitory">
        <input-item title="宿舍" slot="formItem">
          <input placeholder="宿舍楼" v-model="formData.dormitory" />
        </input-item>
      </evan-form-item>

      <divide-title class="underline fix-type">报修类型</divide-title>
      <evan-form-item prop="fixType">
        <radio-item
          slot="formItem"
          :radio-items="fixType"
          :check-value.sync="formData.fixType"
        ></radio-item>
      </evan-form-item>

      <divide-title class="underline wrong-type">故障类型</divide-title>
      <evan-form-item prop="wrongType">
        <radio-item
          slot="formItem"
          :radio-items="wrongType"
          :check-value.sync="formData.wrongType"
        ></radio-item>
      </evan-form-item>

      <divide-title class="underline wrong-detail"
        >故障详细描述
        <text style="color: red;" class="font-base">*</text>
      </divide-title>
      <evan-form-item prop="wrongDetail">
        <textarea-item
          slot="formItem"
          v-model="formData.wrongDetail"
        ></textarea-item>
      </evan-form-item>

      <divide-title class="underline service-type">服务类型</divide-title>
      <evan-form-item prop="serviceType">
        <radio-item
          slot="formItem"
          :radio-items="serviceType"
          :check-value.sync="formData.serviceType"
        ></radio-item>
      </evan-form-item>

      <divide-title class="underline personnel">选择维修人员</divide-title>
      <evan-form-item prop="value">
        <radio-item
          slot="formItem"
          :radio-items="personnelRadio"
          :check-value.sync="formData.value"
        ></radio-item>
      </evan-form-item>
    </evan-form>

    <button
      class="cu-btn lg block bg-black"
      open-type="getUserInfo"
      :disabled="disabled"
      @click="submit"
    >
      提交
    </button>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { IRepairForm, RepairForm } from "@/api/entry-form";
import DivideTitle from "@/cpns/divide-title/index.vue";
import EvanForm from "@/components/evan-form/evan-form.vue";
import EvanFormItem from "@/components/evan-form-item/evan-form-item.vue";
import InputItem from "@/cpns/input-item/index.vue";
import RadioItem from "@/cpns/radio-item/index.vue";
import RadioData from "@/cpns/radio-item/radio-data";
import TextareaItem from "@/cpns/textarea-item/index.vue";
import { getPersonnel, IPersonnel, postRepairForm } from "@/api/free-fix";
import shuffle from "lodash";
import { getUserInfo } from "@/utils/utils";
import { requestFreeFixMsg } from "@/api/common";

@Component({
  components: {
    DivideTitle,
    EvanFormItem,
    EvanForm,
    InputItem,
    RadioItem,
    TextareaItem,
  },
})
export default class FreeFix extends Vue {
  private formData: IRepairForm = new RepairForm();
  private fixType: RadioData[] = [
    { name: "笔记本电脑", value: "笔记本电脑", checked: true },
    { name: "台式电脑", value: "台式电脑", checked: false },
    { name: "手机", value: "手机", checked: false },
  ];
  private wrongType: RadioData[] = [
    { name: "能进入系统", value: "能进入系统", checked: true },
    {
      name: "不能进入系统，但能开机",
      value: "不能进入系统，但能开机",
      checked: false,
    },
    { name: "不能开机", value: "不能开机", checked: false },
  ];
  private serviceType: RadioData[] = [
    { name: "送修", value: "送修", checked: true },
    { name: "上门维修", value: "上门维修", checked: false },
  ];
  private personnel: IPersonnel[] = [];
  private rules = {
    name: [{ required: true, message: "请输入姓名" }],
    phone: [{ required: true, message: "请输入手机号码" }],
    wechat: [{ required: true, message: "请输入微信" }],
    value: [{ required: true, message: "请选择义维人员，若无法选请联系我们" }],
    wrongDetail: [{ required: true, message: "请输入故障详情" }],
  };
  private disabled = false;

  private get personnelRadio(): RadioData[] {
    return this.personnel
      .filter((value) => value.count != 0)
      .map<RadioData>((value, index) => {
        return {
          name: value.name + `(${value.count})`,
          value: value.value,
          checked: index == 0,
        };
      });
  }

  private async loadPersonnel() {
    const p = await getPersonnel();
    this.personnel = shuffle(p).valueOf();
  }

  created() {
    this.loadPersonnel();
  }

  private async submit() {
    this.disabled = true;
    await requestFreeFixMsg();
    await getUserInfo().catch(() => (this.disabled = false));
    (this.$refs.form as any).validate(async (b: boolean) => {
      if (b) {
        await this.submit_();
      }
      this.disabled = false;
    });
  }

  private async submit_() {
    this.personnel.every((item) => {
      if (item.value === this.formData.value) {
        this.formData.personnel = item.name;
        return false;
      }
      return true;
    });

    if (await postRepairForm(this.formData)) {
      await uni.showModal({ content: "提交成功", showCancel: false });
      uni.navigateBack();
    } else {
      await uni.showModal({ content: "提交失败", showCancel: false });
    }
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.form-item {
  background-color: $uni-bg-color;
}

.fix-type,
.wrong-type,
.service-type,
.personnel,
.wrong-detail {
  /deep/ .divide-title {
    margin-top: $uni-spacing-col-lg;
  }
}

.cu-btn {
  margin: 30rpx 20rpx;
  background-color: black;
}
</style>
