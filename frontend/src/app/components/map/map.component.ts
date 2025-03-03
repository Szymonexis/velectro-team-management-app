import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { MapFilterModalComponent } from './components/map-filter-modal/map-filter-modal.component';
import { GOOGLE_MAPS_OPTIONS, MODAL_HEIGHT, MODAL_WIDTH } from './map.model';
import { MapService } from './map.service';
import { DATE_TEMPLATE_FORMAT } from '../../shared/models/date-format.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _mapService = inject(MapService);

  options = GOOGLE_MAPS_OPTIONS;
  date_format = DATE_TEMPLATE_FORMAT;
  markers$ = this._mapService.markers$;

  onOpenFilters(): void {
    const dialogRef = this._dialog.open(MapFilterModalComponent, {
      width: MODAL_WIDTH,
      height: MODAL_HEIGHT,
      panelClass: 'filter-modal',
    });

    dialogRef.afterClosed();
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow): void {
    infoWindow.open(marker);
  }
}
