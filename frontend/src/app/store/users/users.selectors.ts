import { createSelector } from '@ngrx/store';

import { AppState } from '../';
import { UsersState } from './users.model';

export const selectUsersState = createSelector(
  (state: AppState): UsersState => state.users,
  (users) => users
);

export const selectPaginationData = createSelector(
  selectUsersState,
  (state) => state.paginationData
);

export const selectUsersStateData = createSelector(selectUsersState, (state) => state.data);

export const selectUsersStateIsLoading = createSelector(
  selectUsersState,
  (state) => state.isLoading
);

export const selectUsersStateError = createSelector(selectUsersState, (state) => state.error);
