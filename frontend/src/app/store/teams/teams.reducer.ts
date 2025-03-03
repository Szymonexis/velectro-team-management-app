import { createReducer, on } from '@ngrx/store';

import { errored, loadedWithData, loading } from '../shared';
import * as teamsActions from './teams.actions';
import { initialState } from './teams.model';

export const teamsReducer = createReducer(
  initialState,
  // -----------getTeams-----------
  on(teamsActions.getTeams, (state) => ({ ...state, ...loading })),
  on(teamsActions.getTeamsSuccess, (state, { data }) => ({
    ...state,
    ...loadedWithData(data),
  })),
  on(teamsActions.getTeamsFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------getMinimalTeams-----------
  on(teamsActions.getMinimalTeams, (state) => ({
    ...state,
    minimalTeams: {
      ...state.minimalTeams,
      ...loading,
    },
  })),
  on(teamsActions.getMinimalTeamsSuccess, (state, { data }) => ({
    ...state,
    minimalTeams: {
      ...state.minimalTeams,
      ...loadedWithData(data),
    },
  })),
  on(teamsActions.getMinimalTeamsFailure, (state, { data }) => ({
    ...state,
    minimalTeams: {
      ...state.minimalTeams,
      ...errored(data),
    },
  })),

  // -----------updatePaginationData-----------
  on(teamsActions.updatePaginationData, (state, { type: __, ...paginationData }) => ({
    ...state,
    paginationData,
  })),

  // -----------createTeam-----------
  on(teamsActions.createTeam, (state) => ({ ...state, ...loading })),
  on(teamsActions.createTeamSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(teamsActions.createTeamFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------deleteTeam-----------
  on(teamsActions.deleteTeam, (state) => ({ ...state, ...loading })),
  on(teamsActions.deleteTeamSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(teamsActions.deleteTeamFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------editTeam-----------
  on(teamsActions.editTeam, (state) => ({ ...state, ...loading })),
  on(teamsActions.editTeamSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(teamsActions.editTeamFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  }))
);
