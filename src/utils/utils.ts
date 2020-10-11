import GetUserInfoSuccessCallbackResult = WechatMiniprogram.GetUserInfoSuccessCallbackResult;

export const getUserInfo = async () => {
  try {
    return ((await wx.getUserInfo(
      {}
    )) as unknown) as GetUserInfoSuccessCallbackResult;
  } catch (e) {
    await uni.showModal({
      content: "该功能需要授权后才能使用",
      showCancel: false,
    });
    throw e;
  }
};

export const copy2board = async (content: string) => {
  await uni.setClipboardData({ data: content });
  await uni.showToast({ title: "复制成功", duration: 1000 });
};
