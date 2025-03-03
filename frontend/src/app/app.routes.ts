import { Routes } from '@angular/router';

import { ClientsComponent } from './components/clients/clients.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { TeamsComponent } from './components/teams/teams.component';
import { UsersComponent } from './components/users/users.component';
import { canActivateDashboard } from './core/guards/can-activate-dashboard.guard';
import { canActivateMap } from './core/guards/can-activate-map.guard';
import { canActivateUsers } from './core/guards/can-activate-users.guard';
import { PATHS } from './shared/paths';

export const routes: Routes = [
  {
    path: `${PATHS.LOGIN}`,
    component: LoginComponent,
  },
  {
    path: `${PATHS.DASHBOARD}`,
    component: DashboardComponent,
    canActivate: [canActivateDashboard],
    children: [
      {
        path: `${PATHS.USERS}`,
        component: UsersComponent,
        canActivate: [canActivateUsers],
      },
      {
        path: `${PATHS.TEAMS}`,
        component: TeamsComponent,
      },
      {
        path: `${PATHS.CLIENTS}`,
        component: ClientsComponent,
      },
      {
        path: `${PATHS.MAP}`,
        component: MapComponent,
        canActivate: [canActivateMap],
      },
      { path: '', redirectTo: `${PATHS.USERS}`, pathMatch: 'full' },
      { path: '**', redirectTo: `${PATHS.USERS}`, pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: `/${PATHS.LOGIN}`, pathMatch: 'full' },
  { path: '**', redirectTo: `/${PATHS.LOGIN}`, pathMatch: 'full' },
];
