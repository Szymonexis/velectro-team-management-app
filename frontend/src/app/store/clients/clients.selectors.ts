import { createSelector } from '@ngrx/store';

import { AppState } from '../';

export const selectClientsState = createSelector(
  (state: AppState) => state.clients,
  (clients) => clients
);

export const selectPaginationData = createSelector(
  (state: AppState) => state.clients.paginationData,
  (paginationData) => paginationData
);

export const selectClientsStateData = createSelector(selectClientsState, (state) => state.data);

export const selectClientsStateIsLoading = createSelector(
  selectClientsState,
  (state) => state.isLoading
);

export const selectClientsStateError = createSelector(selectClientsState, (state) => state.error);
