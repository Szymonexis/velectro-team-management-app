import { DisplayedColumns } from '../../shared/models/grid-display.model';
import { FilterFieldTypes, FilterRange } from '../../shared/models/pagination.model';

// Displayed columns
export const DISPLAYED_COLUMNS: DisplayedColumns[] = [
  {
    columnDef: 'username',
    columnName: 'Nazwa użytkownika',
    columnType: 'string',
  },
  {
    columnDef: 'name',
    columnName: 'Imię i nazwisko',
    columnType: 'string',
  },
  {
    columnDef: 'canCreate',
    columnName: 'Może dodawać',
    columnType: 'boolean',
  },
  {
    columnDef: 'canDelete',
    columnName: 'Może usuwać',
    columnType: 'boolean',
  },
  {
    columnDef: 'canUpdate',
    columnName: 'Może modyfikować',
    columnType: 'boolean',
  },
  {
    columnDef: 'isAdmin',
    columnName: 'Administrator',
    columnType: 'boolean',
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

// Filter fields
export type UserFilterField = {
  key: UserFilterFieldKeys;
  type: FilterFieldTypes;
  options: {
    label: string;
    value: boolean | string | number | Date | FilterRange<number> | FilterRange<Date> | undefined;
  }[];
};

export enum UserFilterFieldKeys {
  isAdmin = 'isAdmin',
  canCreate = 'canCreate',
  canUpdate = 'canUpdate',
  canDelete = 'canDelete',
}

type FilterFieldsType = {
  [key in UserFilterFieldKeys]: {
    label: string;
    options: {
      label: string;
      value: any;
    }[];
    type: FilterFieldTypes;
  };
};

export type FilterFields = {
  label: string;
  options: {
    label: string;
    value: any;
  }[];
  type: FilterFieldTypes;
  key: UserFilterFieldKeys;
  value: {
    label: string;
    value: any;
  };
}[];

export type InitialCheckedFiltersType = {
  [key in UserFilterFieldKeys]: {
    value: any;
    type: FilterFieldTypes;
  };
};

export const INITIAL_CHECKED_FILTERS: InitialCheckedFiltersType = {
  isAdmin: { value: null, type: FilterFieldTypes.Boolean },
  canCreate: { value: null, type: FilterFieldTypes.Boolean },
  canUpdate: { value: null, type: FilterFieldTypes.Boolean },
  canDelete: { value: null, type: FilterFieldTypes.Boolean },
};

export const USER_FILTER_FIELDS: FilterFieldsType = {
  [UserFilterFieldKeys.isAdmin]: {
    label: 'Administrator',
    options: [
      { label: '', value: null },
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
    type: FilterFieldTypes.Boolean,
  },
  [UserFilterFieldKeys.canCreate]: {
    label: 'Może dodawać',
    options: [
      { label: '', value: null },
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
    type: FilterFieldTypes.Boolean,
  },
  [UserFilterFieldKeys.canUpdate]: {
    label: 'Może modyfikować',
    options: [
      { label: '', value: null },
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
    type: FilterFieldTypes.Boolean,
  },
  [UserFilterFieldKeys.canDelete]: {
    label: 'Może usuwać',
    options: [
      { label: '', value: null },
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
    ],
    type: FilterFieldTypes.Boolean,
  },
};

// User query keys
export enum UserQueryKeys {
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
