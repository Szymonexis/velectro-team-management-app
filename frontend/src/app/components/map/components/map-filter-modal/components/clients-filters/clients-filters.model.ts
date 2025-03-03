import { FormControl } from '@angular/forms';

export interface ClientsFiltersForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  invoiceAcceptanceDate: FormControl<Date | null>;
  invoiceEndDate: FormControl<Date | null>;
  invoiceIsDone: FormControl<boolean | null>;
  team: FormControl<string | null>;
  voivodeship: FormControl<string | null>;
}

export type ClientsFilters = {
  name: string | null;
  address: string | null;
  invoiceAcceptanceDate: Date | null;
  invoiceEndDate: Date | null;
  invoiceIsDone: boolean | null;
  team: string | null;
  voivodeship: string | null;
};

export const CLIENTS_DEFAULT_FILTERS: ClientsFilters = {
  name: '',
  address: '',
  invoiceAcceptanceDate: null,
  invoiceEndDate: null,
  invoiceIsDone: false,
  team: '',
  voivodeship: '',
};
