import { DisplayedColumns } from '../../../../../../shared/models/grid-display.model';

export const DISPLAYED_COLUMNS: DisplayedColumns[] = [
  {
    columnDef: 'showOnMap',
    columnName: 'Pokaż na mapie',
    columnType: 'boolean',
  },
  {
    columnDef: 'name',
    columnName: 'Nazwa klienta',
    columnType: 'string',
  },
  {
    columnDef: 'team',
    columnName: 'Przypisany zespół',
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
    columnDef: 'address',
    columnName: 'Adres',
    columnType: 'string',
  },
  {
    columnDef: 'voivodeship',
    columnName: 'Województwo',
    columnType: 'string',
  },
];

export const DISPLAYED_COLUMNS_IDS = DISPLAYED_COLUMNS.map((col) => col.columnDef);
