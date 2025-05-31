export interface PaginationMetadata {
  sortBy: string;
  descending: boolean;
  page: number;
  size: number;
  filterField: Record<string, string>;
}

export const DEFAULT_PAGINATION: PaginationMetadata = {
  sortBy: '',
  descending: false,
  page: 0,
  size: 10,
  filterField: {},
};
