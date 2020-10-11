wx.cloud.init({
  env: "xenvironment-25da7d",
  // env: 'xtest-11dfdd',
  traceUser: true,
});

export const db = wx.cloud.database();
export const cloud = wx.cloud;

export default {
  call(name: string, data?: any) {
    return wx.cloud.callFunction({
      name,
      data,
    });
  },
};
