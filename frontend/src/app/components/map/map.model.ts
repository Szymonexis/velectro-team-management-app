import { FormControl } from '@angular/forms';
import { MapClientResponse, MapTeamResponse } from '../../core/http/map/types/response.types';

export interface FilterMapClientsForm {
  name: FormControl<string | null>;
  voivodeship: FormControl<string | null>;
  address: FormControl<string | null>;
  invoiceIsDone: FormControl<boolean | null>;
  invoiceAcceptanceDate: FormControl<Date | null | undefined>;
}

export interface MapOptions {
  mapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
}

export interface MarkerOptions {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  markerIconUrl: string;
  label?: string;
  circleOptions?: {
    center: google.maps.LatLngLiteral;
    radius: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    fillColor: string;
    fillOpacity: number;
  };
  client?: MapClientResponse;
  team?: MapTeamResponse;
}

export interface CircleOptions {
  center: google.maps.LatLngLiteral;
  radius: number;
  strokeColor: string;
  fillColor: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface CrewData {
  name: string;
  job: string;
  startDate: string;
  endDate: string;
}

export const GOOGLE_MAPS_OPTIONS: google.maps.MapOptions = {
  mapId: 'DEMO_MAP_ID',

  center: { lat: 52.068801577, lng: 19.479718612 }, // Centered on Warsaw
  zoom: 7,
  disableDefaultUI: true,
};

export enum TRAFFIC_LIGHT {
  NONE = 'NONE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export const MODAL_WIDTH = '85dvw';
export const MODAL_HEIGHT = '85dvh';
