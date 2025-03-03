import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { BaseHttpService } from '../base-http.service';
import { GetAllMapClientsResponse, GetAllMapTeamsResponse } from './types/response.types';

@Injectable({ providedIn: 'root' })
export class MapHttpService extends BaseHttpService {
  getAllMapTeams(): Observable<GetAllMapTeamsResponse> {
    return this.httpClient.get<GetAllMapTeamsResponse>(`${this.baseUrl}/team/all/map`);
  }

  getAllMapClients(): Observable<GetAllMapClientsResponse> {
    return this.httpClient.get<GetAllMapClientsResponse>(`${this.baseUrl}/client/all/map`);
  }
}
