import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

const FILTERS_PATTERN = /^([a-zA-Z]+=[a-zA-Z]+)|([a-zA-Z]+=(\d+:\d+))$/;
const SORTERS_PATTERN = /^(-?[a-zA-Z]+)$/;

export class PaginationRequestDto {
  @IsOptional()
  @IsString()
  search?: string = '';

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsString({ each: true })
  @Matches(FILTERS_PATTERN, {
    each: true,
    message: 'Each filter must match the pattern: "fieldName"',
  })
  filters?: string[] = [];

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsString({ each: true })
  @Matches(SORTERS_PATTERN, {
    each: true,
    message: 'Each sorter must match the pattern: "fieldName" or "-fieldName"',
  })
  sorters?: string[] = [];

  @Transform(({ value }) => value ?? 10)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @IsIn([10, 25, 50, 100], {
    message: 'Page size must be one of the following: 10, 25, 50, 100',
  })
  pageSize: number = 10;

  @Transform(({ value }) => value ?? 0)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  pageIndex: number = 0;
}
