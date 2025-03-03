import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MapClientResponse, MapTeamResponse } from '../../../../core/http/map/types/response.types';
import { DATE_FORMAT } from '../../../../shared/models/date-format.model';
import { ClientsFiltersComponent } from './components/clients-filters/clients-filters.component';
import {
  CLIENTS_DEFAULT_FILTERS,
  ClientsFilters,
} from './components/clients-filters/clients-filters.model';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { TeamsTableComponent } from './components/teams-table/teams-table.component';
import { DataFilterService } from './services/data-filter.service';
import { TeamsFiltersComponent } from './components/teams-filters/teams-filters.component';
import { TEAMS_DEFAULT_FILTERS, TeamsFilters } from './components/teams-filters/team-filters.model';
import { FilterPanelsEnum } from './map-filter-modal.model';

@Component({
  selector: 'app-map-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ClientsTableComponent,
    TeamsTableComponent,
    ClientsFiltersComponent,
    TeamsFiltersComponent,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
  templateUrl: './map-filter-modal.component.html',
  styleUrl: './map-filter-modal.component.scss',
})
export class MapFilterModalComponent implements OnInit {
  private readonly _dataFilterService = inject(DataFilterService);
  readonly dialogRef = inject<MatDialogRef<MapFilterModalComponent>>(MatDialogRef);
  readonly clientsPanelOpenState = signal(false);
  readonly teamsPanelOpenState = signal(false);

  filteredClients$ = new Observable<MapClientResponse[] | null>();

  filteredTeams$ = new Observable<MapTeamResponse[] | null>();

  filterPanelsEnum = FilterPanelsEnum;

  ngOnInit(): void {
    this.filteredClients$ = this._dataFilterService.filterClients(CLIENTS_DEFAULT_FILTERS);
    this.filteredTeams$ = this._dataFilterService.filterTeams(TEAMS_DEFAULT_FILTERS);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onClientsFiltersChange(clientsFilters: ClientsFilters): void {
    this.filteredClients$ = this._dataFilterService.filterClients(clientsFilters);
  }

  onTeamsFiltersChange(teamsFilters: TeamsFilters): void {
    this.filteredTeams$ = this._dataFilterService.filterTeams(teamsFilters);
  }

  togglePanelState(panelType: FilterPanelsEnum): void {
    switch (panelType) {
      case FilterPanelsEnum.Clients:
        this.clientsPanelOpenState.set(!this.clientsPanelOpenState());
        break;
      case FilterPanelsEnum.Teams:
        this.teamsPanelOpenState.set(!this.teamsPanelOpenState());
        break;
    }
  }
}
