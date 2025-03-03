import { isNil } from 'lodash-es';

import { createReducer, on } from '@ngrx/store';

import * as notificationActions from './notification.actions';
import { initialState } from './notification.model';

export const notificationReducer = createReducer(
  initialState,
  on(notificationActions.add, (state, { notification }) => ({
    ...state,
    notifications: isNil(notification)
      ? [...state.notifications]
      : [...state.notifications, notification],
  })),

  on(notificationActions.removeAt, (state, { index }) => ({
    ...state,
    notifications: state.notifications.filter((_, i) => i !== index),
  })),

  on(notificationActions.clearAll, (state) => ({ ...state, notifications: [] })),

  on(notificationActions.setShowing, (state, { showing }) => ({ ...state, showing }))
);
