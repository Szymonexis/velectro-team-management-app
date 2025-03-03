import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

import { MapClientResponse } from '../../../../../../core/http/map/types/response.types';
import { DISPLAYED_COLUMNS, DISPLAYED_COLUMNS_IDS } from './clients-table.model';
import { MapFacade } from '../../../../../../store/map/map.facade';
import { DATE_TEMPLATE_FORMAT } from '../../../../../../shared/models/date-format.model';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.scss',
})
export class ClientsTableComponent {
  private readonly _mapFacade = inject(MapFacade);
  @Input() clients: MapClientResponse[] | null | undefined = null;

  displayedColumns = DISPLAYED_COLUMNS;
  displayedColumnsIds = DISPLAYED_COLUMNS_IDS;

  date_format = DATE_TEMPLATE_FORMAT;

  toggleShowOnMap(id: string): void {
    this._mapFacade.toggleClientShowOnMap(id);
  }
}
