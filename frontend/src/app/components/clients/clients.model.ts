import { DisplayedColumns } from '../../shared/models/grid-display.model';
import { FilterFieldTypes, FilterRange } from '../../shared/models/pagination.model';

export const DISPLAYED_COLUMNS: DisplayedColumns[] = [
  {
    columnDef: 'showOnMap',
    columnName: 'Uwzględniaj na mapie',
    columnType: 'boolean',
  },
  {
    columnDef: 'name',
    columnName: 'Nazwa klienta',
    columnType: 'string',
  },
  {
    columnDef: 'address',
    columnName: 'Adres',
    columnType: 'string',
  },
  {
    columnDef: 'invoiceAcceptanceDate',
    columnName: 'Data akceptacji faktury',
    columnType: 'date',
  },
  {
    columnDef: 'invoiceEndDate',
    columnName: 'Data końca faktury',
    columnType: 'date',
  },
  {
    columnDef: 'invoiceIsDone',
    columnName: 'Zakończone',
    columnType: 'boolean',
  },
  {
    columnDef: 'teamId', // Pobierane z minimal teams w teams store
    columnName: 'Przypisany zespół',
    columnType: 'fromData',
  },
  {
    columnDef: 'description',
    columnName: 'Opis',
    columnType: 'string',
  },
  {
    columnDef: 'createdAt',
    columnName: 'Data utworzenia',
    columnType: 'date',
  },
  {
    columnDef: 'updatedAt',
    columnName: 'Data modyfikacji',
    columnType: 'date',
  },
  {
    columnDef: 'actions',
    columnName: 'Akcje',
    columnType: 'action',
  },
];

export const DISPLAYED_COLUMNS_IDS = DISPLAYED_COLUMNS.map((col) => col.columnDef);

export enum ClientQueryKeys {
  pageIndex = 'pageIndex',
  pageSize = 'pageSize',
  search = 'search',
  sorters = 'sorters',
  filters = 'filters',
}

export type SorterAndFiltersForRequest = {
  filters: string[];
  sorters: string | undefined;
};

export const MODAL_WIDTH = '40rem';

// Filters (unused for now)

export type ClientFilterField = {
  key: ClientFilterFieldKeys;
  type: FilterFieldTypes;
  options: {
    label: string;
    value: boolean | string | number | Date | FilterRange<number> | FilterRange<Date> | undefined;
  }[];
};

export type FilterFields = {
  label: string;
  options: {
    label: string;
    value: any;
  }[];
  type: FilterFieldTypes;
  key: ClientFilterFieldKeys;
  value: {
    label: string;
    value: any;
  };
}[];

type FilterFieldsType = {
  [key in ClientFilterFieldKeys]: {
    label: string;
    options: {
      label: string;
      value: any;
    }[];
    type: FilterFieldTypes;
  };
};

export enum ClientFilterFieldKeys {}

export const CLIENT_FILTER_FIELDS: FilterFieldsType = {};

export type InitialCheckedFiltersType = {
  [key in ClientFilterFieldKeys]: {
    value: any;
    type: FilterFieldTypes;
  };
};

export const INITIAL_CHECKED_FILTERS: InitialCheckedFiltersType = {};
