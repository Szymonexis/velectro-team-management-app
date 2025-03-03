import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../';
import {
  CreateUserRequest,
  DeleteUserRequest,
  EditUserCredentialsRequest,
  EditUserInfoRequest,
  UsersDataRequest,
} from '../../core/http/users/types/request.types';
import { DEFAULT_PAGINATION_DATA, PaginationData } from '../shared';
import * as usersActions from './users.actions';
import * as usersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
  private readonly _store = inject(Store<AppState>);

  usersStateData$ = this._store.select(usersSelectors.selectUsersStateData);
  usersStateIsLoading$ = this._store.select(usersSelectors.selectUsersStateIsLoading);
  usersStateError$ = this._store.select(usersSelectors.selectUsersStateError);
  paginationData$ = this._store.select(usersSelectors.selectPaginationData);

  getUsers(props: UsersDataRequest): void {
    const { pageIndex, pageSize, sorters, filters, search } = {
      ...DEFAULT_PAGINATION_DATA,
      ...props,
    };

    this._store.dispatch(
      usersActions.getUsers({
        pageIndex,
        pageSize,
        sorters,
        filters,
        search,
      })
    );
  }

  updatePaginationData(props: PaginationData): void {
    this._store.dispatch(usersActions.updatePaginationData(props));
  }

  createUser(props: CreateUserRequest): void {
    this._store.dispatch(usersActions.createUser(props));
  }

  editUserInfo(props: EditUserInfoRequest): void {
    this._store.dispatch(usersActions.editUserInfo(props));
  }

  editUserCredentials(props: EditUserCredentialsRequest): void {
    this._store.dispatch(usersActions.editUserCredentials(props));
  }

  deleteUser(props: DeleteUserRequest): void {
    this._store.dispatch(usersActions.deleteUser(props));
  }
}
