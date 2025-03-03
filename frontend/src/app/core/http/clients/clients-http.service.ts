import { isNil } from 'lodash-es';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseHttpService } from '../base-http.service';
import {
  ClientsDataRequest,
  CreateClientRequest,
  DeleteClientRequest,
  EditClientRequest,
} from './types/request.types';
import { ClientArrayPaginatedResponse, ClientResponse } from './types/response.types';

@Injectable({ providedIn: 'root' })
export class ClientsHttpService extends BaseHttpService {
  getClients(payload: ClientsDataRequest): Observable<ClientArrayPaginatedResponse> {
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

    return this.httpClient.get<ClientArrayPaginatedResponse>(`${this.baseUrl}/client`, {
      params: queryParams,
    });
  }

  createClient(payload: CreateClientRequest): Observable<ClientResponse> {
    return this.httpClient.post<ClientResponse>(`${this.baseUrl}/client`, payload);
  }

  editClient(payload: EditClientRequest): Observable<ClientResponse> {
    return this.httpClient.patch<ClientResponse>(`${this.baseUrl}/client`, payload);
  }

  deleteClient(payload: DeleteClientRequest): Observable<ClientResponse> {
    return this.httpClient.delete<ClientResponse>(`${this.baseUrl}/client/${payload.id}`);
  }
}
