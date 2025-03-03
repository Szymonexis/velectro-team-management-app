import { catchError, map, of, switchMap, take, tap } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ClientsHttpService } from '../../core/http/clients/clients-http.service';
import { TeamsFacade } from '../teams/teams.facade';
import * as clientsActions from './clients.actions';
import { ClientsFacade } from './clients.facade';

export class ClientsEffects {
  private readonly _clientsHttpService = inject(ClientsHttpService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _clientsFacade = inject(ClientsFacade);
  private readonly _teamsFacade = inject(TeamsFacade);
  private readonly _router = inject(Router);
  private readonly _actions$ = inject(Actions);
  private readonly _paginationData$ = this._clientsFacade.paginationData$;

  getClients$ = createEffect(() =>
    this._actions$.pipe(
      ofType(clientsActions.getClients),
      switchMap((payload) =>
        this._clientsHttpService.getClients(payload).pipe(
          map((response) => {
            return clientsActions.getClientsSuccess({
              notification: null,
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              clientsActions.getClientsFailure({
                notification: {
                  type: 'error',
                  message: 'Pobranie danych klientow nie powiodlo sie',
                },
                data: error,
              })
            )
          )
        )
      )
    )
  );

  getClientsSuccess$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(clientsActions.getClientsSuccess),
        tap(() => {
          this._teamsFacade.getMinimalTeams();
        })
      ),
    { dispatch: false }
  );

  updatePaginationData$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(clientsActions.updatePaginationData),
        tap(({ type: __, ...paginationData }) => {
          this._router.navigate([], {
            queryParams: paginationData,
            relativeTo: this._activatedRoute,
          });

          this._clientsFacade.getClients(paginationData);
        })
      ),
    { dispatch: false }
  );

  createClient$ = createEffect(() =>
    this._actions$.pipe(
      ofType(clientsActions.createClient),
      switchMap((payload) =>
        this._clientsHttpService.createClient(payload).pipe(
          map(() => {
            return clientsActions.createClientSuccess({
              notification: { type: 'success', message: 'Utworzenie klienta zakończone sukcesem' },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              clientsActions.createClientFailure({
                notification: { type: 'error', message: 'Utworzenie klienta nie powiodło się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._clientsFacade.getClients(paginationData);
        });
      })
    )
  );

  deleteClient$ = createEffect(() =>
    this._actions$.pipe(
      ofType(clientsActions.deleteClient),
      switchMap((payload) =>
        this._clientsHttpService.deleteClient(payload).pipe(
          map(() => {
            return clientsActions.deleteClientSuccess({
              notification: { type: 'success', message: 'Usunięcie klienta zakończone sukcesem' },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              clientsActions.deleteClientFailure({
                notification: { type: 'error', message: 'Usunięcie klienta nie powiodło się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._clientsFacade.getClients(paginationData);
        });
      })
    )
  );

  editClient$ = createEffect(() =>
    this._actions$.pipe(
      ofType(clientsActions.editClient),
      switchMap((payload) =>
        this._clientsHttpService.editClient(payload).pipe(
          map(() => {
            return clientsActions.editClientSuccess({
              notification: { type: 'success', message: 'Edycja zespołu zakończona sukcesem' },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              clientsActions.editClientFailure({
                notification: { type: 'error', message: 'Edycja zespołu nie powiodła się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._clientsFacade.getClients(paginationData);
        });
      })
    )
  );
}
