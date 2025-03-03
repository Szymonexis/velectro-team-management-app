import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../';
import { LoginRequest } from '../../core/http/auth/types/request.types';
import * as auhtActions from './auth.actions';
import * as authSelectors from './auth.selectors';

@Injectable()
export class AuthFacade {
  private readonly _store = inject(Store<AppState>);

  authState$ = this._store.select(authSelectors.selectAuthState);

  login(payload: LoginRequest): void {
    this._store.dispatch(auhtActions.login(payload));
  }

  refreshToken(): void {
    this._store.dispatch(auhtActions.refreshToken());
  }

  logout(): void {
    this._store.dispatch(auhtActions.logout());
  }
}
