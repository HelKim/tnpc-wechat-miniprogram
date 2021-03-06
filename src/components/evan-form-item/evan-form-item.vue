<template>
  <view>
    <slot name="formItem" v-if="$slots.formItem"></slot>
    <view
      v-else
      class="evan-form-item-container"
      :class="'evan-form-item-container--' + mLabelPosition"
      :style="{ borderWidth: border ? '1rpx' : 0 }"
    >
      <view
        v-if="label"
        class="evan-form-item-container__label"
        :class="{
          showAsteriskRect: hasRequiredAsterisk,
          isRequired: showRequiredAsterisk,
        }"
        :style="mLabelStyle"
        >{{ label }}</view
      >
      <view class="evan-form-item-container__main" :style="mContentStyle">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "EvanFormItem",
  props: {
    labelStyle: Object,
    label: String,
    contentStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    prop: String,
    border: {
      type: Boolean,
      default: true,
    },
    labelPosition: {
      validator: function (value) {
        if (!value) {
          return true;
        }
        return ["top", "left"].indexOf(value) !== -1;
      },
      default: "",
    },
  },
  computed: {
    mLabelStyle() {
      const parent = this.getParent();
      let labelStyle = Object.assign(
        {},
        parent.labelStyle || {},
        this.labelStyle || {}
      );
      let arr = Object.keys(labelStyle).map(
        (key) => `${key}:${labelStyle[key]}`
      );
      return arr.join(";");
    },
    mContentStyle() {
      let contentStyle = Object.assign({}, this.contentStyle || {});
      let arr = Object.keys(contentStyle).map(
        (key) => `${key}:${contentStyle[key]}`
      );
      return arr.join(";");
    },
    mLabelPosition() {
      if (this.labelPosition) {
        return this.labelPosition;
      }
      const parent = this.getParent();
      if (parent) {
        return parent.labelPosition;
      }
      return "left";
    },
    // 整个表单是否有*号
    hasRequiredAsterisk() {
      const parent = this.getParent();
      if (parent) {
        return parent.hasRequiredAsterisk;
      }
      return false;
    },
    // 当前formItem是否显示*号
    showRequiredAsterisk() {
      const parent = this.getParent();
      if (parent && parent.hideRequiredAsterisk) {
        return false;
      }
      const rules = this.getRules();
      if (rules && rules.length > 0) {
        if (rules.find((rule) => rule.required === true)) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    // 获取EvanForm组件
    getParent() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "EvanForm") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    getRules() {
      let form = this.getParent();
      let formRules = form.mRules;
      formRules = formRules ? formRules[this.prop] : [];
      return [].concat(formRules || []);
    },
  },
};
</script>

<style lang="scss">
.evan-form-item-container {
  border-bottom: 1rpx solid #eee;

  &__label {
    font-size: $uni-font-size-base;
    color: #666;
    line-height: 40rpx;
    padding: 25rpx 0;
    display: inline-block;

    &.showAsteriskRect::before {
      content: "";
      color: #f56c6c;
      width: 30rpx;
      display: inline-block;
    }

    &.isRequired::before {
      content: "*";
    }
  }

  &__main {
    flex: 1;
    min-height: 90rpx;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  &--left {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  &--top {
    .evan-form-item-container__label {
      padding-bottom: 10rpx;
    }
  }
}
</style>
