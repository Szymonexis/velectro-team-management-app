import { createReducer, on } from '@ngrx/store';

import { errored, loadedWithData, loading } from '../shared';
import * as authActions from './auth.actions';
import { initialState } from './auth.model';

export const authReducer = createReducer(
  initialState,
  on(authActions.login, (state) => ({ ...state, ...loading })),
  on(authActions.loginSuccess, (state, { data: payload }) => ({
    ...state,
    ...loadedWithData(payload),
  })),
  on(authActions.loginFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  on(authActions.refreshToken, (state) => ({ ...state, ...loading })),
  on(authActions.refreshTokenSuccess, (state, { data: payload }) => ({
    ...state,
    ...loadedWithData(payload),
  })),
  on(authActions.refreshTokenFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  on(authActions.logout, () => initialState)
);
