import { AsyncPipe } from '@angular/common';
import { Component, inject, Injector } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { AuthFacade } from '../../store/auth/auth.facade';
import { getDashboardItems } from './dashboard.items';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, MatTabsModule, MatButtonModule, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly _authFacade = inject(AuthFacade);
  private readonly _injector = inject(Injector);

  dashboardItems$ = getDashboardItems(this._injector);

  logout(): void {
    this._authFacade.logout();
  }
}
