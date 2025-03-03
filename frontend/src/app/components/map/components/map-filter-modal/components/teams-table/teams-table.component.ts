import { Component, inject, Input } from '@angular/core';
import { MapFacade } from '../../../../../../store/map/map.facade';
import { DISPLAYED_COLUMNS, DISPLAYED_COLUMNS_IDS } from './teams-table.model';
import { MapTeamResponse } from '../../../../../../core/http/map/types/response.types';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { DATE_TEMPLATE_FORMAT } from '../../../../../../shared/models/date-format.model';

@Component({
  selector: 'app-teams-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule],
  templateUrl: './teams-table.component.html',
  styleUrl: './teams-table.component.scss',
})
export class TeamsTableComponent {
  private readonly _mapFacade = inject(MapFacade);
  @Input() teams: MapTeamResponse[] | null | undefined = null;

  displayedColumns = DISPLAYED_COLUMNS;
  displayedColumnsIds = DISPLAYED_COLUMNS_IDS;

  date_format = DATE_TEMPLATE_FORMAT;

  toggleShowOnMap(id: string): void {
    this._mapFacade.toggleTeamShowOnMap(id);
  }
}
