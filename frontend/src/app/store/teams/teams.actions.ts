import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import {
  CreateTeamRequest,
  DeleteTeamRequest,
  EditTeamRequest,
  TeamsDataRequest,
} from '../../core/http/teams/types/request.types';
import {
  MinimalTeamResponse,
  TeamArrayPaginatedResponse,
} from '../../core/http/teams/types/response.types';
import { NotificationPayload } from '../notification/notification.model';
import { PaginationData } from '../shared';

export const getTeams = createAction('[Teams] getTeams', props<TeamsDataRequest>());

export const getTeamsSuccess = createAction(
  '[Teams] getTeamsSuccess',
  props<NotificationPayload<TeamArrayPaginatedResponse>>()
);

export const getTeamsFailure = createAction(
  '[Teams] getTeamsFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const getMinimalTeams = createAction('[Teams] getMinimalTeams');

export const getMinimalTeamsSuccess = createAction(
  '[Teams] getMinimalTeamsSuccess',
  props<NotificationPayload<MinimalTeamResponse[]>>()
);

export const getMinimalTeamsFailure = createAction(
  '[Teams] getMinimalTeamsFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const updatePaginationData = createAction(
  '[Teams] updatePaginationData',
  props<PaginationData>()
);

export const createTeam = createAction('[Teams] createTeam', props<CreateTeamRequest>());

export const createTeamSuccess = createAction(
  '[Teams] createTeamSuccess',
  props<NotificationPayload>()
);

export const createTeamFailure = createAction(
  '[Teams] createTeamFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const deleteTeam = createAction('[Teams] deleteTeam', props<DeleteTeamRequest>());

export const deleteTeamSuccess = createAction(
  '[Teams] deleteTeamSuccess',
  props<NotificationPayload>()
);

export const deleteTeamFailure = createAction(
  '[Teams] deleteTeamFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const editTeam = createAction('[Teams] editTeam', props<EditTeamRequest>());

export const editTeamSuccess = createAction(
  '[Teams] editTeamSuccess',
  props<NotificationPayload>()
);

export const editTeamFailure = createAction(
  '[Teams] editTeamFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);
