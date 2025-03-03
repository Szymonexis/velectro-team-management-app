import { createReducer, on } from '@ngrx/store';

import { errored, loadedWithData, loading } from '../shared';
import * as usersActions from './users.actions';
import { initialState } from './users.model';

export const usersReducer = createReducer(
  initialState,
  // -----------getUsers-----------
  on(usersActions.getUsers, (state) => ({ ...state, ...loading })),
  on(usersActions.getUsersSuccess, (state, { data }) => ({
    ...state,
    ...loadedWithData(data),
  })),
  on(usersActions.getUsersFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------updatePaginationData-----------
  on(usersActions.updatePaginationData, (state, { type: __, ...paginationData }) => ({
    ...state,
    paginationData,
  })),

  // -----------createUser-----------
  on(usersActions.createUser, (state) => ({ ...state, ...loading })),
  on(usersActions.createUserSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(usersActions.createUserFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------editUserInfo-----------
  on(usersActions.editUserInfo, (state) => ({ ...state, ...loading })),
  on(usersActions.editUserInfoSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(usersActions.editUserInfoFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------editUserCredentials-----------
  on(usersActions.editUserCredentials, (state) => ({ ...state, ...loading })),
  on(usersActions.editUserCredentialsSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(usersActions.editUserCredentialsFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------deleteUser-----------
  on(usersActions.deleteUser, (state) => ({ ...state, ...loading })),
  on(usersActions.deleteUserSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(usersActions.deleteUserFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  }))
);
