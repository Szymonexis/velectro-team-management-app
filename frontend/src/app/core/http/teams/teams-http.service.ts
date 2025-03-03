import { isNil } from 'lodash-es';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseHttpService } from '../base-http.service';
import {
  CreateTeamRequest,
  DeleteTeamRequest,
  EditTeamRequest,
  TeamsDataRequest,
} from './types/request.types';
import {
  MinimalTeamArrayResponse,
  TeamArrayPaginatedResponse,
  TeamResponse,
} from './types/response.types';

@Injectable({ providedIn: 'root' })
export class TeamsHttpService extends BaseHttpService {
  getTeams(payload: TeamsDataRequest): Observable<TeamArrayPaginatedResponse> {
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

    return this.httpClient.get<TeamArrayPaginatedResponse>(`${this.baseUrl}/team`, {
      params: queryParams,
    });
  }

  getMinimalTeams(): Observable<MinimalTeamArrayResponse> {
    return this.httpClient.get<MinimalTeamArrayResponse>(`${this.baseUrl}/team/minimal`);
  }

  createTeam(payload: CreateTeamRequest): Observable<TeamResponse> {
    return this.httpClient.post<TeamResponse>(`${this.baseUrl}/team`, payload);
  }

  editTeam(payload: EditTeamRequest): Observable<TeamResponse> {
    return this.httpClient.patch<TeamResponse>(`${this.baseUrl}/team`, payload);
  }

  deleteTeam(payload: DeleteTeamRequest): Observable<TeamResponse> {
    return this.httpClient.delete<TeamResponse>(`${this.baseUrl}/team/${payload.id}`);
  }
}
