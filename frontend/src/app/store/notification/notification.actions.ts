import { createAction, props } from '@ngrx/store';

import { NotificationContent } from './notification.model';

export const add = createAction(
  '[Notification] add',
  props<{ notification: NotificationContent }>()
);

export const setShowing = createAction('[Notification] setShowing', props<{ showing: boolean }>());

export const removeAt = createAction('[Notification] removeAt', props<{ index: number }>());

export const clearAll = createAction('[Notification] clearAll');
