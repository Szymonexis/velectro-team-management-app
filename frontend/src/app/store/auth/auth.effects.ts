import { catchError, map, of, switchMap, tap } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthHttpService } from '../../core/http/auth/auth-http.service';
import { PATHS } from '../../shared/paths';
import * as authActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _authHttpService = inject(AuthHttpService);
  private readonly _router = inject(Router);

  login$ = createEffect(() =>
    this._actions$.pipe(
      ofType(authActions.login),
      switchMap((payload) => {
        return this._authHttpService.login(payload).pipe(
          map((response) =>
            authActions.loginSuccess({
              notification: { type: 'success', message: 'Logowanie zakonczone sukcesem' },
              data: response,
            })
          ),
          tap(() => {
            this._router.navigate([`/${PATHS.DASHBOARD}`]);
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              authActions.loginFailure({
                notification: { type: 'error', message: 'Logowanie nie powiodło sie' },
                data: error,
              })
            )
          )
        );
      })
    )
  );

  logout$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          this._router.navigate([`/`]);
        })
      ),
    { dispatch: false }
  );

  refreshRoken$ = createEffect(() =>
    this._actions$.pipe(
      ofType(authActions.refreshToken),
      switchMap(() => {
        return this._authHttpService.refreshToken().pipe(
          map((response) =>
            authActions.refreshTokenSuccess({
              notification: { type: 'success', message: 'Odnowienie tokenu udane' },
              data: response,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              authActions.refreshTokenFailure({
                notification: {
                  type: 'error',
                  message: 'Odnowienie tokenu nie powiodlo sie - zaloguj sie jeszcze raz',
                },
                data: error,
              })
            )
          )
        );
      })
    )
  );

  refreshTokenFailure$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(authActions.refreshTokenFailure),
        tap(() => this._router.navigate(['/', PATHS.LOGIN]))
      ),
    { dispatch: false }
  );
}
