import { createSelector } from '@ngrx/store';

import { AppState } from '../';
import { NotificationState } from './notification.model';

export const selectSuccessesState = createSelector(
  (state: AppState): NotificationState => state.notification,
  (successes) => successes
);
