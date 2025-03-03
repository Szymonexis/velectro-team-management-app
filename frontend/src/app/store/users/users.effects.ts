import { catchError, map, of, switchMap, take, tap } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { UsersHttpService } from '../../core/http/users/users-http.service';
import * as usersActions from './users.actions';
import { UsersFacade } from './users.facade';

@Injectable()
export class UsersEffects {
  private readonly _usersHttpService = inject(UsersHttpService);
  private readonly _usersFacade = inject(UsersFacade);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _actions$ = inject(Actions);
  private readonly _paginationData$ = this._usersFacade.paginationData$;

  getUsers$ = createEffect(() =>
    this._actions$.pipe(
      ofType(usersActions.getUsers),
      switchMap((payload) =>
        this._usersHttpService.getUsers(payload).pipe(
          map((response) => {
            return usersActions.getUsersSuccess({
              notification: null,
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              usersActions.getUsersFailure({
                notification: {
                  type: 'error',
                  message: 'Pobranie danych uzytkownikow nie powiodło sie',
                },
                data: error,
              })
            )
          )
        )
      )
    )
  );

  updatePaginationData$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(usersActions.updatePaginationData),
        tap(({ type: __, ...paginationData }) => {
          this._router.navigate([], {
            queryParams: paginationData,
            relativeTo: this._activatedRoute,
          });

          this._usersFacade.getUsers(paginationData);
        })
      ),
    { dispatch: false }
  );

  createUser$ = createEffect(() =>
    this._actions$.pipe(
      ofType(usersActions.createUser),
      switchMap((payload) =>
        this._usersHttpService.createUser(payload).pipe(
          map(() => {
            return usersActions.createUserSuccess({
              notification: {
                type: 'success',
                message: 'Utworzenie użytkownika zakończone sukcesem',
              },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              usersActions.createUserFailure({
                notification: { type: 'error', message: 'Utworzenie użytkownika nie powiodło się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._usersFacade.getUsers(paginationData);
        });
      })
    )
  );

  editUserInfo$ = createEffect(() =>
    this._actions$.pipe(
      ofType(usersActions.editUserInfo),
      switchMap((payload) =>
        this._usersHttpService.editUserInfo(payload).pipe(
          map(() => {
            return usersActions.editUserInfoSuccess({
              notification: {
                type: 'success',
                message: 'Edycja informacji użytkownika zakończona sukcesem',
              },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              usersActions.editUserInfoFailure({
                notification: {
                  type: 'error',
                  message: 'Edycja informacji użytkownika nie powiodła się',
                },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._usersFacade.getUsers(paginationData);
        });
      })
    )
  );

  editUserCredentials$ = createEffect(() =>
    this._actions$.pipe(
      ofType(usersActions.editUserCredentials),
      switchMap((payload) =>
        this._usersHttpService.editUserCredentials(payload).pipe(
          map(() => {
            return usersActions.editUserCredentialsSuccess({
              notification: {
                type: 'success',
                message: 'Edycja danych logowania użytkownika zakończona sukcesem',
              },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              usersActions.editUserCredentialsFailure({
                notification: {
                  type: 'error',
                  message: 'Edycja danych logowania użytkownika nie powiodła sie',
                },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._usersFacade.getUsers(paginationData);
        });
      })
    )
  );

  deleteUser$ = createEffect(() =>
    this._actions$.pipe(
      ofType(usersActions.deleteUser),
      switchMap((payload) =>
        this._usersHttpService.deleteUser(payload).pipe(
          map(() => {
            return usersActions.deleteUserSuccess({
              notification: {
                type: 'success',
                message: 'Usunięcie użytkownika zakończone sukcesem',
              },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              usersActions.deleteUserFailure({
                notification: { type: 'error', message: 'Usuwanie użytkownika nie powiodło się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._usersFacade.getUsers(paginationData);
        });
      })
    )
  );
}
