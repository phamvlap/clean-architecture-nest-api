export type PaginationResponse<T> = {
  previous: number | null;
  next: number | null;
  count: number;
  data: Array<T>;
};
