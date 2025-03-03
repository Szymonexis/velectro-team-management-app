import { isNil } from 'lodash-es';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseHttpService } from '../base-http.service';
import {
  CreateUserRequest,
  DeleteUserRequest,
  EditUserCredentialsRequest,
  EditUserInfoRequest,
  UsersDataRequest,
} from './types/request.types';
import {
  UserPaginatedArrayResponse,
  UserResponse,
  UsersArrayResponse,
} from './types/response.types';

@Injectable({ providedIn: 'root' })
export class UsersHttpService extends BaseHttpService {
  getUsers(payload: UsersDataRequest): Observable<UserPaginatedArrayResponse> {
    let queryParams = new HttpParams();

    if (!isNil(payload.pageIndex)) {
      queryParams = queryParams.set('pageIndex', `${payload.pageIndex}`);
    }

    if (!isNil(payload.pageSize)) {
      queryParams = queryParams.set('pageSize', `${payload.pageSize}`);
    }

    if (!isNil(payload.search)) {
      queryParams = queryParams.set('search', payload.search);
    }

    if (!isNil(payload.sorters) && payload.sorters.length > 0) {
      payload.sorters.forEach((sorter) => {
        queryParams = queryParams.append('sorters', sorter);
      });
    }

    if (!isNil(payload.filters) && payload.filters.length > 0) {
      payload.filters.forEach((filter) => {
        queryParams = queryParams.append('filters', filter);
      });
    }

    return this.httpClient.get<UserPaginatedArrayResponse>(`${this.baseUrl}/user`, {
      params: queryParams,
    });
  }

  createUser(payload: CreateUserRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.baseUrl}/user`, payload);
  }

  editUserInfo(payload: EditUserInfoRequest): Observable<UserResponse> {
    return this.httpClient.patch<UserResponse>(`${this.baseUrl}/user`, payload);
  }

  editUserCredentials(payload: EditUserCredentialsRequest): Observable<UserResponse> {
    return this.httpClient.patch<UserResponse>(`${this.baseUrl}/user/credentials`, payload);
  }

  deleteUser(payload: DeleteUserRequest): Observable<UsersArrayResponse> {
    return this.httpClient.delete<UsersArrayResponse>(`${this.baseUrl}/user/${payload.id}`);
  }
}
