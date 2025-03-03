export enum FilterFieldTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  RangeNumber = 'Range(Number)', // range defined as <min_number>:<max_number>
  RangeDate = 'Range(Date)', // range defined as <min_date>:<max_date>
}

export type FilterRange<T> = { gte: T; lt: T };

export interface FilterFieldTransformerReturnType {
  [FilterFieldTypes.String]: string | null;
  [FilterFieldTypes.Number]: number | null;
  [FilterFieldTypes.Boolean]: boolean | null;
  [FilterFieldTypes.Date]: Date | null;
  [FilterFieldTypes.RangeNumber]: FilterRange<number> | null;
  [FilterFieldTypes.RangeDate]: FilterRange<Date> | null;
}
