import { DisplayedColumns } from '../../../../../../shared/models/grid-display.model';

export const DISPLAYED_COLUMNS: DisplayedColumns[] = [
  {
    columnDef: 'showOnMap',
    columnName: 'Pokaż na mapie',
    columnType: 'boolean',
  },
  {
    columnDef: 'name',
    columnName: 'Nazwa zespołu',
    columnType: 'string',
  },
  {
    columnDef: 'range',
    columnName: 'Zasięg',
    columnType: 'number',
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
