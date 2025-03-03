import { UserPaginatedArrayResponse } from '../../core/http/users/types/response.types';
import { DEFAULT_PAGINATION_DATA, LoadableState, PaginationStoreData } from '../shared';

export type BasicUsersState = LoadableState<UserPaginatedArrayResponse>;

export type UsersState = BasicUsersState & PaginationStoreData;

export const initialState: UsersState = {
  isLoading: false,
  error: null,
  data: null,
  paginationData: DEFAULT_PAGINATION_DATA,
};
