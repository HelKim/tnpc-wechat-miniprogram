import { Vue, Component } from "vue-property-decorator";
import { copy2board } from "@/utils/utils";
@Component
export default class copy2boardMixin extends Vue {
  private async copy(content: string) {
    await copy2board(content);
  }
}
