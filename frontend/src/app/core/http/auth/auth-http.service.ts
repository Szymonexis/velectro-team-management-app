import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { BaseHttpService } from '../base-http.service';
import { LoginRequest } from './types/request.types';
import { LoginResponse } from './types/response.types';

@Injectable({ providedIn: 'root' })
export class AuthHttpService extends BaseHttpService {
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  refreshToken(): Observable<LoginResponse> {
    return this.httpClient.get<LoginResponse>(`${this.baseUrl}/auth/refresh-token`);
  }
}
