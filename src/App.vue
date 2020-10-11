<script lang="ts">
import Vue from "vue";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";

export default Vue.extend({
  mpType: "app",
  async onLaunch() {
    AppModule.INIT_RECENT_MENU();
    await Promise.all([AppModule.Init(), UserModule.Login()]);
  },
  onShow() {},
  onHide() {},
});
</script>

<style lang="scss">
/*每个页面公共css */
@import "utils/global.scss";
</style>
