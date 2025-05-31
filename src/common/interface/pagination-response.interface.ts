export interface SortInfo {
  field?: string; // nama kolom yang disort
  direction?: 'ASC' | 'DESC'; // arah sorting
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginationResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; //current page
  sort: SortInfo;
  first: boolean;
  numberOfElements: number; //size of current page
  empty: boolean;
}
