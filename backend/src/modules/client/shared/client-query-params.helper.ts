import { Prisma } from '@prisma/client';

export type ClientScalarField = Partial<
  keyof typeof Prisma.ClientScalarFieldEnum
>;

// left here for reference

// export type ClientScalarFilterFieldType = Partial<
//   keyof Pick<typeof Prisma.ClientScalarFieldEnum, ''>
// >;

// export type ClientFilterFieldsTransformersType = {
//   [key in ClientScalarFilterFieldType]: (
//     value: string,
//   ) => FilterFieldTransformerReturnType[FilterFieldTypes];
// };

// export class ClientFilterFieldsTransformers
//   implements ClientFilterFieldsTransformersType {}

export const CLIENT_SORT_FIELDS: ClientScalarField[] = [
  'id',
  'name',
  'updatedAt',
  'createdAt',
  'createdById',
  'editedById',
  'address',
  'invoiceAcceptanceDate',
  'invoiceEndDate',
  'invoiceIsDone',
  'voivodeship',
] as const;

export const CLIENT_DEFAULT_SORT_FIELD: ClientScalarField = 'name';

export const CLIENT_SEARCH_FIELDS: ClientScalarField[] = [
  'name',
  'address',
  'description',
] as const;

export const CLIENT_FILTER_FIELDS = [];

export const CLIENT_FILTER_FIELDS_TRANSFORMERS = {};
