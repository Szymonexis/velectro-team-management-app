import { DisplayedColumns } from '../../shared/models/grid-display.model';
import { FilterFieldTypes, FilterRange } from '../../shared/models/pagination.model';

export const DISPLAYED_COLUMNS: DisplayedColumns[] = [
  {
    columnDef: 'name',
    columnName: 'Nazwa firmy',
    columnType: 'string',
  },
  {
    columnDef: 'address',
    columnName: 'Adres',
    columnType: 'string',
  },
  {
    columnDef: 'voivodeship',
    columnName: 'Województwo',
    columnType: 'string',
  },
  {
    columnDef: 'range',
    columnName: 'Zasięg',
    columnType: 'range',
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

export enum TeamQueryKeys {
  pageIndex = 'pageIndex',
  pageSize = 'pageSize',
  search = 'search',
  sorters = 'sorters',
  filters = 'filters',
}

export type TeamFilterField = {
  key: TeamFilterFieldKeys;
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
  key: TeamFilterFieldKeys;
  value: {
    label: string;
    value: any;
  };
}[];

type FilterFieldsType = {
  [key in TeamFilterFieldKeys]: {
    label: string;
    options: {
      label: string;
      value: any;
    }[];
    type: FilterFieldTypes;
  };
};

export enum TeamFilterFieldKeys {
  range = 'range',
}

export const TEAM_FILTER_FIELDS: FilterFieldsType = {
  [TeamFilterFieldKeys.range]: {
    label: 'Zasięg',
    options: [
      { label: '', value: null },
      { label: '0km-10km', value: { min: 0, max: 10 } },
      { label: '10km-25km', value: { min: 10, max: 25 } },
      { label: '25km-50km', value: { min: 25, max: 50 } },
      { label: '50km-150km', value: { min: 50, max: 150 } },
      { label: 'więcej niż 150km', value: { min: 150, max: Number.MAX_SAFE_INTEGER } },
    ],
    type: FilterFieldTypes.RangeNumber,
  },
};

export type InitialCheckedFiltersType = {
  [key in TeamFilterFieldKeys]: {
    value: any;
    type: FilterFieldTypes;
  };
};

export const INITIAL_CHECKED_FILTERS: InitialCheckedFiltersType = {
  range: { value: null, type: FilterFieldTypes.RangeNumber },
};

export type SorterAndFiltersForRequest = {
  filters: string[];
  sorters: string | undefined;
};

export const MODAL_WIDTH = '40rem';
