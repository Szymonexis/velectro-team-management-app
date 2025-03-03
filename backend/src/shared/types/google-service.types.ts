export type GoogleServiceGeocodeResult = {
  voivodeship: string | null;
  position: {
    lat: number;
    lng: number;
  } | null;
};

export const DEFAULT_GEOCODE_RESULT: GoogleServiceGeocodeResult = {
  voivodeship: null,
  position: null,
};
