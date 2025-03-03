import { createReducer, on } from '@ngrx/store';

import { errored, loadedWithData, loading } from '../shared';
import * as mapActions from './map.actions';
import { initialState } from './map.model';
import { isNil } from 'lodash-es';

export const mapReducer = createReducer(
  initialState,
  on(mapActions.getAllMapClients, (state) => ({
    ...state,
    clients: {
      ...state.clients,
      ...loading,
    },
  })),
  on(mapActions.getAllMapClientsSuccess, (state, { data }) => ({
    ...state,
    clients: {
      ...state.clients,
      ...loadedWithData(data ? data.map((client) => ({ ...client, showOnMap: false })) : null),
    },
  })),
  on(mapActions.getAllMapClientsFailure, (state, { data }) => ({
    ...state,
    clients: {
      ...state.clients,
      ...errored(data),
    },
  })),

  on(mapActions.getAllMapTeams, (state) => ({
    ...state,
    teams: {
      ...state.teams,
      ...loading,
    },
  })),

  on(mapActions.getAllMapTeamsSuccess, (state, { data }) => ({
    ...state,
    teams: {
      ...state.teams,
      ...loadedWithData(data),
    },
  })),

  on(mapActions.getAllMapTeamsFailure, (state, { data }) => ({
    ...state,
    teams: {
      ...state.teams,
      ...errored(data),
    },
  })),

  on(mapActions.toggleClientShowOnMap, (state, { id }) => {
    if (!isNil(state?.clients?.data)) {
      const clients = state?.clients?.data?.map((client) =>
        client.id === id ? { ...client, showOnMap: !client?.showOnMap } : client
      );

      return {
        ...state,
        clients: {
          ...state.clients,
          ...loadedWithData(clients),
        },
      };
    }
    return { ...state };
  }),

  on(mapActions.toggleTeamShowOnMap, (state, { id }) => {
    if (!isNil(state?.teams?.data)) {
      const teams = state?.teams?.data?.map((team) =>
        team.id === id ? { ...team, showOnMap: !team?.showOnMap } : team
      );

      return {
        ...state,
        teams: {
          ...state.teams,
          ...loadedWithData(teams),
        },
      };
    }

    return { ...state };
  })
);
