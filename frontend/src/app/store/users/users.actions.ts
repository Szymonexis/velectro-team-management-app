import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import {
  CreateUserRequest,
  DeleteUserRequest,
  EditUserCredentialsRequest,
  EditUserInfoRequest,
  UsersDataRequest,
} from '../../core/http/users/types/request.types';
import { UserPaginatedArrayResponse } from '../../core/http/users/types/response.types';
import { NotificationPayload } from '../notification/notification.model';
import { PaginationData } from '../shared';

export const getUsers = createAction('[Users] getUsers', props<UsersDataRequest>());

export const getUsersSuccess = createAction(
  '[Users] getUsersSuccess',
  props<NotificationPayload<UserPaginatedArrayResponse>>()
);

export const getUsersFailure = createAction(
  '[Users] getUsersFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const updatePaginationData = createAction(
  '[Users] updatePaginationData',
  props<PaginationData>()
);

export const createUser = createAction('[Users] createUser', props<CreateUserRequest>());
export const createUserSuccess = createAction(
  '[Users] createUserSuccess',
  props<NotificationPayload>()
);
export const createUserFailure = createAction(
  '[Users] createUserFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const editUserInfo = createAction('[Users] editUserInfo', props<EditUserInfoRequest>());
export const editUserInfoSuccess = createAction(
  '[Users] editUserInfoSuccess',
  props<NotificationPayload>()
);
export const editUserInfoFailure = createAction(
  '[Users] editUserInfoFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const editUserCredentials = createAction(
  '[Users] editUserCredentials',
  props<EditUserCredentialsRequest>()
);
export const editUserCredentialsSuccess = createAction(
  '[Users] editUserCredentialsSuccess',
  props<NotificationPayload>()
);
export const editUserCredentialsFailure = createAction(
  '[Users] editUserCredentialsFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const deleteUser = createAction('[Users] deleteUser', props<DeleteUserRequest>());
export const deleteUserSuccess = createAction(
  '[Users] deleteUserSuccess',
  props<NotificationPayload>()
);
export const deleteUserFailure = createAction(
  '[Users] deleteUserFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);
