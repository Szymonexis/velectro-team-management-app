export type FilterRange<T> = { min: T; max: T };

export enum FilterFieldTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  RangeNumber = 'Range(Number)', // range defined as <min_number>:<max_number>
  RangeDate = 'Range(Date)', // range defined as <min_date>:<max_date>
}
