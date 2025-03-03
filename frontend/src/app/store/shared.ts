import { HttpErrorResponse } from '@angular/common/http';

export interface LoadableState<T> {
  data: T | null;
  isLoading: boolean;
  error: HttpErrorResponse | Error | string | null;
}

export const loading: Pick<LoadableState<unknown>, 'isLoading'> = {
  isLoading: true,
};

export const loaded: Pick<LoadableState<unknown>, 'isLoading'> = {
  isLoading: false,
};

export const loadedWithData = <K>(data: LoadableState<K>['data']): LoadableState<K> => ({
  data,
  isLoading: false,
  error: null,
});

export const errored = (
  error: LoadableState<unknown>['error']
): Omit<LoadableState<unknown>, 'data'> => ({
  error,
  isLoading: false,
});

export interface PaginationData {
  search: string;
  filters: string[];
  sorters: string[];
  pageIndex: number;
  pageSize: number;
}

export interface PaginationStoreData {
  paginationData: PaginationData;
}

export const DEFAULT_PAGINATION_DATA: PaginationData = {
  search: '',
  filters: [],
  sorters: [],
  pageIndex: 0,
  pageSize: 10,
};
