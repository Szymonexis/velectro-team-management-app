import { catchError, map, of, switchMap, take, tap } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { TeamsHttpService } from '../../core/http/teams/teams-http.service';
import * as teamsActions from './teams.actions';
import { TeamsFacade } from './teams.facade';

@Injectable()
export class TeamsEffects {
  private readonly _teamsHttpService = inject(TeamsHttpService);
  private readonly _teamsFacade = inject(TeamsFacade);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _actions$ = inject(Actions);
  private readonly _paginationData$ = this._teamsFacade.paginationData$;

  getTeams$ = createEffect(() =>
    this._actions$.pipe(
      ofType(teamsActions.getTeams),
      switchMap((payload) =>
        this._teamsHttpService.getTeams(payload).pipe(
          map((response) => {
            return teamsActions.getTeamsSuccess({
              notification: null,
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              teamsActions.getTeamsFailure({
                notification: { type: 'error', message: 'Pobranie danych druzyn nie powiodlo sie' },
                data: error,
              })
            )
          )
        )
      )
    )
  );

  getMinimalTeams$ = createEffect(() =>
    this._actions$.pipe(
      ofType(teamsActions.getMinimalTeams),
      switchMap(() =>
        this._teamsHttpService.getMinimalTeams().pipe(
          map(({ teams }) => {
            return teamsActions.getMinimalTeamsSuccess({
              notification: null,
              data: teams,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              teamsActions.getMinimalTeamsFailure({
                notification: { type: 'error', message: 'Pobranie danych druzyn nie powiodlo sie' },
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
        ofType(teamsActions.updatePaginationData),
        tap(({ type: __, ...paginationData }) => {
          this._router.navigate([], {
            queryParams: paginationData,
            relativeTo: this._activatedRoute,
          });

          this._teamsFacade.getTeams(paginationData);
        })
      ),
    { dispatch: false }
  );

  createTeam$ = createEffect(() =>
    this._actions$.pipe(
      ofType(teamsActions.createTeam),
      switchMap((payload) =>
        this._teamsHttpService.createTeam(payload).pipe(
          map(() => {
            return teamsActions.createTeamSuccess({
              notification: { type: 'success', message: 'Utworzenie zespołu zakończone sukcesem' },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              teamsActions.createTeamFailure({
                notification: { type: 'error', message: 'Utworzenie zespołu nie powiodło się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._teamsFacade.getTeams(paginationData);
        });
      })
    )
  );

  deleteTeam$ = createEffect(() =>
    this._actions$.pipe(
      ofType(teamsActions.deleteTeam),
      switchMap((payload) =>
        this._teamsHttpService.deleteTeam(payload).pipe(
          map(() => {
            return teamsActions.deleteTeamSuccess({
              notification: { type: 'success', message: 'Usunięcie zespołu zakończone sukcesem' },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              teamsActions.deleteTeamFailure({
                notification: { type: 'error', message: 'Usunięcie zespołu nie powiodło się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._teamsFacade.getTeams(paginationData);
        });
      })
    )
  );

  editTeam$ = createEffect(() =>
    this._actions$.pipe(
      ofType(teamsActions.editTeam),
      switchMap((payload) =>
        this._teamsHttpService.editTeam(payload).pipe(
          map(() => {
            return teamsActions.editTeamSuccess({
              notification: { type: 'success', message: 'Edycja zespołu zakończona sukcesem' },
              data: undefined,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              teamsActions.editTeamFailure({
                notification: { type: 'error', message: 'Edycja zespołu nie powiodła się' },
                data: error,
              })
            )
          )
        )
      ),
      tap(() => {
        this._paginationData$.pipe(take(1)).subscribe((paginationData) => {
          this._teamsFacade.getTeams(paginationData);
        });
      })
    )
  );
}
