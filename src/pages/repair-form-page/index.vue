<template>
  <view class="repair-form-page">
    <nav-bar-simple title="报修信息"></nav-bar-simple>
    <divide-title class="underline">联系信息</divide-title>
    <uni-list>
      <uni-list-item
        title="姓名"
        :right-text="repairForm.name"
        @click="copy(repairForm.name)"
      ></uni-list-item>
      <uni-list-item
        title="手机"
        :right-text="repairForm.phone"
        @click="copy(repairForm.phone)"
      ></uni-list-item>
      <uni-list-item
        title="微信"
        :right-text="repairForm.wechat"
        @click="copy(repairForm.wechat)"
      ></uni-list-item>
      <uni-list-item
        v-if="repairForm.dormitory"
        title="宿舍"
        :right-text="repairForm.dormitory"
        @click="copy(repairForm.dormitory)"
      ></uni-list-item>
    </uni-list>
    <divide-title class="underline margin-bottom">报修信息</divide-title>
    <uni-list>
      <uni-list-item
        title="状态"
        :right-text="repairForm.status"
      ></uni-list-item>
      <uni-list-item
        title="报修"
        :right-text="repairForm.fixType"
        @click="copy(repairForm.fixType)"
      ></uni-list-item>
      <uni-list-item
        title="类型"
        :right-text="repairForm.wrongType"
        @click="copy(repairForm.wrongType)"
      ></uni-list-item>
    </uni-list>
    <divide-title class="underline margin-bottom">故障详细描述</divide-title>
    <text class="wrong-detail" @click="copy(repairForm.wrongType)">{{
      repairForm.wrongDetail
    }}</text>
    <divide-title class="underline margin-bottom">服务信息</divide-title>
    <uni-list>
      <uni-list-item
        title="类型"
        :right-text="repairForm.serviceType"
        @click="copy(repairForm.serviceType)"
      ></uni-list-item>
      <uni-list-item
        title="服务人员"
        :right-text="repairForm.personnel"
        @click="copy(repairForm.personnel)"
      ></uni-list-item>
    </uni-list>
    <divide-title class="underline margin-bottom" v-if="repairForm.assessment"
      >评价信息</divide-title
    >
    <uni-list v-if="repairForm.assessment">
      <uni-list-item
        title="评分"
        :right-text="repairForm.assessment"
        @click="copy(repairForm.assessment)"
      ></uni-list-item>
      <uni-list-item
        title="内容"
        :right-text="repairForm.assessmentContent"
        @click="copy(repairForm.assessmentContent)"
      ></uni-list-item>
      <uni-list-item
        title="时间"
        :right-text="formatter(repairForm.assessmentDate)"
      ></uni-list-item>
    </uni-list>
    <divide-title class="underline margin-bottom">时间</divide-title>
    <uni-list>
      <uni-list-item
        title="提交"
        :right-text="formatter(repairForm.date)"
      ></uni-list-item>
      <uni-list-item
        title="接受"
        :right-text="formatter(repairForm.acceptDate)"
        v-if="repairForm.acceptDate"
      ></uni-list-item>
      <uni-list-item
        title="完成"
        :right-text="formatter(repairForm.finishDate)"
        v-if="repairForm.finishDate"
      ></uni-list-item>
      <uni-list-item
        title="取消"
        :right-text="formatter(repairForm.cancelDate)"
        v-if="repairForm.cancelDate"
      ></uni-list-item>
      <uni-list-item
        title="关闭"
        :right-text="formatter(repairForm.closeDate)"
        v-if="repairForm.closeDate"
      ></uni-list-item>
    </uni-list>
    <view class="btns">
      <button
        class="cu-btn block bg-red lg"
        v-if="
          isSuperUser &&
          (repairForm.status === FixStatus.submit ||
            repairForm.status === FixStatus.accept)
        "
        @click="putForm(FixStatus.close)"
      >
        关闭
      </button>
      <button
        class="cu-btn block bg-blue lg"
        v-if="isSuperUser && repairForm.status === FixStatus.submit"
        @click="putForm(FixStatus.accept)"
      >
        接单
      </button>
      <button
        class="cu-btn block bg-blue lg"
        v-if="isSuperUser && repairForm.status === FixStatus.accept"
        @click="putForm(FixStatus.finish)"
      >
        完成
      </button>
      <button
        class="cu-btn block bg-red lg"
        v-if="
          openid === repairForm._openid &&
          repairForm.status === FixStatus.submit
        "
        @click="putForm(FixStatus.cancel)"
      >
        取消
      </button>
      <button
        class="cu-btn block bg-blue lg"
        @click="clickAssess"
        v-if="
          openid === repairForm._openid &&
          (repairForm.status === FixStatus.finish ||
            repairForm.status === FixStatus.close)
        "
      >
        评价
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UniList from "@/components/uni-list/uni-list.vue";
import UniListItem from "@/components/uni-list-item/uni-list-item.vue";
import { IRepairForm } from "@/api/entry-form";
import DivideTitle from "@/cpns/divide-title/index.vue";
import { FixStatus, getRepairForm, putRepairForm } from "@/api/free-fix";
import moment from "moment";
import { mixins } from "vue-class-component";
import copy2boardMixin from "@/mixins/copy2boardMixin";
import Security from "@/mixins/security";
import { UserModule } from "@/store/modules/user";

@Component({
  components: { UniListItem, UniList, DivideTitle },
})
export default class RepairFormPage extends mixins(copy2boardMixin, Security) {
  private repairForm: IRepairForm = {} as IRepairForm;
  private id: string = "id";
  private FixStatus = FixStatus;

  onLoad(option: any) {
    if (option.id) {
      this.id = option.id;
      this.load();
    }
  }

  private async load() {
    this.repairForm = await getRepairForm(this.id);
  }

  private formatter(date: Date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }

  private async putForm(type: string) {
    const res = await putRepairForm(type, this.repairForm);
    if (res) {
      uni.showToast({ title: type, duration: 2000 });
      this.repairForm.status = type;
    } else {
      uni.showToast({ title: "操作失败", duration: 2000 });
    }
  }

  private clickAssess() {
    uni.navigateTo({
      url: `/pages/assessment/submit?id=${this.repairForm._id}`,
    });
  }
}
</script>

<style scoped lang="scss">
// @formatter:off
.margin-bottom {
  /deep/ .divide-title {
    margin-top: $uni-spacing-col-lg;
  }
}

.wrong-detail {
  background-color: $uni-bg-color;
  font-size: $uni-font-size-base;
  padding: $uni-spacing-col-lg;
  display: block;
}

.btns {
  display: flex;
  margin: 30rpx 20rpx;
}

.cu-btn {
  margin: 0 10rpx;
  flex-grow: 1;
}
</style>
