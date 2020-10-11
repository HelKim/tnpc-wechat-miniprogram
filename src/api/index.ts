export interface IPageParam {
  // 从0开始,第几页
  page: number;
  // 每页的数据量
  count: number;
  order?: IOrder;
}

export interface IOrder {
  prop: string;
  // asc or desc
  direction: string;
}
