import { ApiProperty } from '@nestjs/swagger';
import {
  FilterFieldTransformerReturnType,
  FilterFieldTypes,
} from '@shared/transformer-functions/helper.types';

export abstract class PaginatedResponseDto {
  @ApiProperty({
    example: 123,
    description: 'Total elements count',
  })
  totalCount: number;

  @ApiProperty({
    example: 0,
    description: 'Page index',
  })
  pageIndex: number;

  @ApiProperty({
    example: 10,
    description: 'Page size',
  })
  pageSize: number;

  abstract filterFields: FilterField<string, FilterFieldTypes>[];
  abstract sortFields: string[];
  abstract searchFields: string[];
}

export interface FilterField<T, K extends FilterFieldTypes> {
  key: T;
  type: K;
  options: FilterFieldTransformerReturnType[K][];
}

export class PositionResponseDto {
  @ApiProperty({
    example: 50.456,
    description: 'Latitude',
  })
  lat: number;

  @ApiProperty({
    example: 19.456,
    description: 'Longitude',
  })
  lng: number;
}
