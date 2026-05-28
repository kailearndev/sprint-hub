export type PaginateModel<TFindManyArgs, TCountArgs> = {
  findMany(args: TFindManyArgs): Promise<any>;
  count(args: TCountArgs): Promise<number>;
};
