import { Vue, Component } from "vue-property-decorator";

@Component
export default class PaginationMixin extends Vue {
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalSize: number = 0;

  public resetPage() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalSize = 0;
  }
}
