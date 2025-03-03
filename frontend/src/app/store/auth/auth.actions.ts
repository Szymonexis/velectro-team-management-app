import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { LoginRequest } from '../../core/http/auth/types/request.types';
import { LoginResponse } from '../../core/http/auth/types/response.types';
import { NotificationPayload } from '../notification/notification.model';

export const login = createAction('[Auth] login', props<LoginRequest>());
export const loginSuccess = createAction(
  '[Auth] login success',
  props<NotificationPayload<LoginResponse>>()
);
export const loginFailure = createAction(
  '[Auth] login failure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const refreshToken = createAction('[Auth] refreshToken');
export const refreshTokenSuccess = createAction(
  '[Auth] refreshToken success',
  props<NotificationPayload<LoginResponse>>()
);
export const refreshTokenFailure = createAction(
  '[Auth] refreshToken failure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const logout = createAction('[Auth] logout');
