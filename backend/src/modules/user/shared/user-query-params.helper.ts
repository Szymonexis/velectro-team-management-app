import { Prisma } from '@prisma/client';
import { booleanTransformer } from '@shared/transformer-functions/boolean.transformer';
import {
  FilterFieldTransformerReturnType,
  FilterFieldTypes,
} from '@shared/transformer-functions/helper.types';
import { FilterField } from '@shared/types/response.types';

export type UserScalarField = Partial<keyof typeof Prisma.UserScalarFieldEnum>;

export type UserScalarFilterFieldType = Partial<
  keyof Pick<
    typeof Prisma.UserScalarFieldEnum,
    'canCreate' | 'canDelete' | 'canUpdate' | 'isAdmin'
  >
>;

export type UserFilterFieldsTransformersType = {
  [key in UserScalarFilterFieldType]: (
    value: string,
  ) => FilterFieldTransformerReturnType[FilterFieldTypes];
};

export class UserFilterFieldsTransformers
  implements UserFilterFieldsTransformersType
{
  canCreate: (
    value: string,
  ) => FilterFieldTransformerReturnType[FilterFieldTypes.Boolean];
  canDelete: (
    value: string,
  ) => FilterFieldTransformerReturnType[FilterFieldTypes.Boolean];
  canUpdate: (
    value: string,
  ) => FilterFieldTransformerReturnType[FilterFieldTypes.Boolean];
  isAdmin: (
    value: string,
  ) => FilterFieldTransformerReturnType[FilterFieldTypes.Boolean];
}

const booleanOptions: FilterFieldTransformerReturnType[FilterFieldTypes.Boolean][] =
  [null, true, false];

export const USER_FILTER_FIELDS: FilterField<
  UserScalarFilterFieldType,
  FilterFieldTypes
>[] = [
  {
    key: 'canCreate',
    type: FilterFieldTypes.Boolean,
    options: booleanOptions,
  },
  {
    key: 'canDelete',
    type: FilterFieldTypes.Boolean,
    options: booleanOptions,
  },
  {
    key: 'canUpdate',
    type: FilterFieldTypes.Boolean,
    options: booleanOptions,
  },
  {
    key: 'isAdmin',
    type: FilterFieldTypes.Boolean,
    options: booleanOptions,
  },
] as const;

export const USER_FILTER_FIELDS_TRANSFORMERS: UserFilterFieldsTransformers = {
  isAdmin: booleanTransformer,
  canCreate: booleanTransformer,
  canDelete: booleanTransformer,
  canUpdate: booleanTransformer,
};

export const USER_SORT_FIELDS: UserScalarField[] = [
  'id',
  'name',
  'updatedAt',
  'createdAt',
  'createdById',
  'editedById',
  'username',
  'canCreate',
  'canDelete',
  'canRead',
  'canUpdate',
  'isAdmin',
] as const;

export const USER_DEFAULT_SORT_FIELD: UserScalarField = 'name';

export const USER_SEARCH_FIELDS: UserScalarField[] = [
  'name',
  'username',
] as const;
