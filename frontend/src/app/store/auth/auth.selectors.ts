import { createSelector } from '@ngrx/store';

import { AppState } from '../';
import { AuthState } from './auth.model';

export const selectAuthState = createSelector(
  (state: AppState): AuthState => state.auth,
  (state: AuthState) => state
);
