import { FormControl } from '@angular/forms';

export interface TeamsFiltersForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  voivodeship: FormControl<string | null>;
  rangeFrom: FormControl<number | null>;
  rangeTo: FormControl<number | null>;
}

export type TeamsFilters = {
  name: string | null;
  address: string | null;
  voivodeship: string | null;
  rangeFrom: number | null;
  rangeTo: number | null;
};

export const TEAMS_DEFAULT_FILTERS: TeamsFilters = {
  name: '',
  address: '',
  voivodeship: '',
  rangeFrom: null,
  rangeTo: null,
};
