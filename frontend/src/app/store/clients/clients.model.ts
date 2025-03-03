import { ClientArrayPaginatedResponse } from '../../core/http/clients/types/response.types';
import { DEFAULT_PAGINATION_DATA, LoadableState, PaginationStoreData } from '../shared';

export type BasicClientsState = LoadableState<ClientArrayPaginatedResponse>;

export type ClientsState = BasicClientsState & PaginationStoreData;

export const initialState: ClientsState = {
  isLoading: false,
  error: null,
  data: null,
  paginationData: DEFAULT_PAGINATION_DATA,
};
