import { catchError, map, of, switchMap } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { MapHttpService } from '../../core/http/map/map-http.service';
import * as mapActions from './map.actions';

@Injectable()
export class MapEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _mapHttpService = inject(MapHttpService);

  getAllMapClients$ = createEffect(() =>
    this._actions$.pipe(
      ofType(mapActions.getAllMapClients),
      switchMap(() => {
        return this._mapHttpService.getAllMapClients().pipe(
          map(({ clients }) => {
            return mapActions.getAllMapClientsSuccess({ data: clients, notification: null });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(mapActions.getAllMapClientsFailure({ data: error, notification: null }));
          })
        );
      })
    )
  );

  getAllMapTeams$ = createEffect(() =>
    this._actions$.pipe(
      ofType(mapActions.getAllMapTeams),
      switchMap(() => {
        return this._mapHttpService.getAllMapTeams().pipe(
          map(({ teams }) => {
            return mapActions.getAllMapTeamsSuccess({ data: teams, notification: null });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(mapActions.getAllMapTeamsFailure({ data: error, notification: null }));
          })
        );
      })
    )
  );
}
