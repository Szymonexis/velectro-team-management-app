import { omit } from 'lodash';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FilterFieldTypes } from '@shared/transformer-functions/helper.types';
import {
  FilterField,
  PaginatedResponseDto,
} from '@shared/types/response.types';
import {
  USER_FILTER_FIELDS,
  USER_SEARCH_FIELDS,
  USER_SORT_FIELDS,
  UserScalarField,
  UserScalarFilterFieldType,
} from '@user/shared/user-query-params.helper';

export function getUserResponseDto(
  user: Prisma.$UserPayload['scalars'],
): UserResponseDto {
  return omit(user, ['password', 'isSuperAdmin']);
}

type UserResponseDtoType = Omit<
  Prisma.$UserPayload['scalars'],
  'password' | 'isSuperAdmin'
>;

export class UserResponseDto implements UserResponseDtoType {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'user',
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    example: false,
    description: 'The isAdmin status of the user',
  })
  isAdmin: boolean;

  @ApiProperty({
    example: false,
    description: 'The canUpdate status of the user',
  })
  canUpdate: boolean;

  @ApiProperty({
    example: false,
    description: 'The canCreate status of the user',
  })
  canCreate: boolean;

  @ApiProperty({
    example: false,
    description: 'The canDelete status of the user',
  })
  canDelete: boolean;

  @ApiProperty({
    example: true,
    description: 'The canRead status of the user',
  })
  canRead: boolean;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The createdAt date of the user',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The updatedAt date of the user',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user that created this user',
  })
  createdById: string | null;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user that last edited this user',
  })
  editedById: string | null;
}

export class UserArrayPaginatedResponseDto extends PaginatedResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: 'The list of users',
  })
  users: UserResponseDto[];

  @ApiProperty({
    example: USER_FILTER_FIELDS,
    description: 'Array of filter fields',
  })
  filterFields: FilterField<UserScalarFilterFieldType, FilterFieldTypes>[];

  @ApiProperty({
    example: USER_SORT_FIELDS,
    description: 'Array of sort fields',
  })
  sortFields: UserScalarField[];

  @ApiProperty({
    example: USER_SEARCH_FIELDS,
    description: 'Array of search fields',
  })
  searchFields: UserScalarField[];
}

export class UserArrayResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: 'The list of users',
  })
  users: UserResponseDto[];
}
