import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { NotificationPayload } from '../notification/notification.model';
import { MapState } from './map.model';

export const getAllMapClients = createAction('[Map] getAllMapClients');

export const getAllMapClientsSuccess = createAction(
  '[Map] getAllMapClientsSuccess',
  props<NotificationPayload<MapState['clients']['data']>>()
);

export const getAllMapClientsFailure = createAction(
  '[Map] getAllMapClientsFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const getAllMapTeams = createAction('[Map] getAllMapTeams');

export const getAllMapTeamsSuccess = createAction(
  '[Map] getAllMapTeamsSuccess',
  props<NotificationPayload<MapState['teams']['data']>>()
);

export const getAllMapTeamsFailure = createAction(
  '[Map] getAllMapTeamsFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const toggleClientShowOnMap = createAction(
  '[Map] toggleClientShowOnMap',
  props<{ id: string }>()
);

export const toggleTeamShowOnMap = createAction(
  '[Map] toggleTeamShowOnMap',
  props<{ id: string }>()
);
