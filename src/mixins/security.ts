import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component
export default class Security extends Vue {
  get isSuperUser() {
    return UserModule.isSuperUser;
  }
  get openid() {
    return UserModule._openid;
  }
}
