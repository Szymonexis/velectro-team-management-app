import { map } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as authActions from '../auth/auth.actions';
import * as clientsActions from '../clients/clients.actions';
import * as teamsActions from '../teams/teams.actions';
import * as usersActions from '../users/users.actions';
import * as notificationActions from './notification.actions';

const AUTH_SUCCESSES = [authActions.loginSuccess, authActions.refreshTokenSuccess];

const USERS_SUCCESSES = [
  usersActions.getUsersSuccess,
  usersActions.createUserSuccess,
  usersActions.editUserInfoSuccess,
  usersActions.editUserCredentialsSuccess,
  usersActions.deleteUserSuccess,
];

const TEAMS_SUCCESSES = [
  teamsActions.getTeamsSuccess,
  teamsActions.getMinimalTeamsSuccess,
  teamsActions.createTeamSuccess,
  teamsActions.editTeamSuccess,
  teamsActions.deleteTeamSuccess,
];

const CLIENTS_SUCCESSES = [
  clientsActions.getClientsSuccess,
  clientsActions.createClientSuccess,
  clientsActions.editClientSuccess,
  clientsActions.deleteClientSuccess,
];

const AUTH_FAILURES = [authActions.loginFailure, authActions.refreshTokenFailure];

const USERS_FAILURES = [
  usersActions.getUsersFailure,
  usersActions.createUserFailure,
  usersActions.editUserInfoFailure,
  usersActions.editUserCredentialsFailure,
  usersActions.deleteUserFailure,
];

const TEAMS_FAILURES = [
  teamsActions.getTeamsFailure,
  teamsActions.getMinimalTeamsFailure,
  teamsActions.createTeamFailure,
  teamsActions.editTeamFailure,
  teamsActions.deleteTeamFailure,
];

const CLIENTS_FAILURES = [
  clientsActions.getClientsFailure,
  clientsActions.createClientFailure,
  clientsActions.editClientFailure,
  clientsActions.deleteClientFailure,
];

@Injectable()
export class NotificationEffects {
  private readonly _actions$ = inject(Actions);

  success$ = createEffect(() =>
    this._actions$.pipe(
      ofType(...AUTH_SUCCESSES, ...USERS_SUCCESSES, ...TEAMS_SUCCESSES, ...CLIENTS_SUCCESSES),
      map(({ notification }) => notificationActions.add({ notification }))
    )
  );

  error$ = createEffect(() =>
    this._actions$.pipe(
      ofType(...AUTH_FAILURES, ...USERS_FAILURES, ...TEAMS_FAILURES, ...CLIENTS_FAILURES),
      map(({ notification }) => notificationActions.add({ notification }))
    )
  );
}
