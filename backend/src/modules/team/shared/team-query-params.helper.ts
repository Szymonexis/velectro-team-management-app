import { Prisma } from '@prisma/client';
import {
  FilterFieldTransformerReturnType,
  FilterFieldTypes,
} from '@shared/transformer-functions/helper.types';
import { rangeNumberTransformer } from '@shared/transformer-functions/range-number.transformer';
import { FilterField } from '@shared/types/response.types';

export type TeamScalarField = Partial<keyof typeof Prisma.TeamScalarFieldEnum>;

export type TeamScalarFilterFieldType = Partial<
  keyof Pick<typeof Prisma.TeamScalarFieldEnum, 'range'>
>;

export type TeamFilterFieldsTransformersType = {
  [key in TeamScalarFilterFieldType]: (
    value: string,
  ) => FilterFieldTransformerReturnType[FilterFieldTypes];
};

export class TeamFilterFieldsTransformers
  implements TeamFilterFieldsTransformersType
{
  range: (value: string) => FilterFieldTransformerReturnType[FilterFieldTypes];
}

const rangeNumberOptions: FilterFieldTransformerReturnType[FilterFieldTypes.RangeNumber][] =
  [
    null,
    { gte: 0, lt: 10 },
    { gte: 10, lt: 25 },
    { gte: 25, lt: 50 },
    { gte: 50, lt: 150 },
    { gte: 150, lt: Number.MAX_SAFE_INTEGER },
  ];

export const TEAM_FILTER_FIELDS: FilterField<
  TeamScalarFilterFieldType,
  FilterFieldTypes
>[] = [
  {
    key: 'range',
    type: FilterFieldTypes.RangeNumber,
    options: rangeNumberOptions,
  },
] as const;

export const TEAM_FILTER_FIELDS_TRANSFORMERS: TeamFilterFieldsTransformers = {
  range: rangeNumberTransformer,
};

export const TEAM_SORT_FIELDS: TeamScalarField[] = [
  'id',
  'name',
  'updatedAt',
  'createdAt',
  'createdById',
  'editedById',
  'range',
  'address',
  'voivodeship',
] as const;

export const TEAM_DEFAULT_SORT_FIELD: TeamScalarField = 'name';

export const TEAM_SEARCH_FIELDS: TeamScalarField[] = [
  'name',
  'address',
  'description',
] as const;
