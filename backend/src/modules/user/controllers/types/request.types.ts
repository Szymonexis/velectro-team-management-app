import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsPassword } from '@shared/validators/is-password.validator';
import { IsUuid } from '@shared/validators/is-uuid.validator';
import { PasswordsMatch } from '@shared/validators/passwords-match.validator';

type PasswordConfirmationDtoType = {
  passwordConfirmation: string;
};

type CreateUserRequestDtoType = Omit<
  Prisma.$UserPayload['scalars'],
  | 'id'
  | 'isSuperAdmin'
  | 'createdAt'
  | 'updatedAt'
  | 'createdById'
  | 'editedById'
> &
  PasswordConfirmationDtoType;

export class CreateUserRequestDto implements CreateUserRequestDtoType {
  @ApiProperty({
    description: 'Username for login (unique)',
    example: 'johndoe',
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'strongPassword123!',
  })
  @IsString()
  @IsDefined()
  @IsPassword()
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'strongPassword123!',
  })
  @IsString()
  @IsDefined()
  @PasswordsMatch('password')
  passwordConfirmation: string;

  @ApiProperty({
    description: 'Is user an admin',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  isAdmin: boolean;

  @ApiProperty({
    description: 'Can user update data (overwritten by isAdmin)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  canUpdate: boolean;

  @ApiProperty({
    description: 'Can user create data (overwritten by isAdmin)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  canCreate: boolean;

  @ApiProperty({
    description: 'Can user delete data (overwritten by isAdmin)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  canDelete: boolean;

  @ApiProperty({
    description: 'Can user read data (overwritten by isAdmin)',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsDefined()
  canRead: boolean;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsDefined()
  name: string;
}

type UserIdRequestDtoType = Pick<Prisma.$UserPayload['scalars'], 'id'>;

export class UserIdRequestDto implements UserIdRequestDtoType {
  @ApiProperty({
    description: 'Id of the user',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;
}

type DeleteUsersRequestDtoType = {
  ids: Prisma.$UserPayload['scalars']['id'][];
};

export class DeleteUsersRequestDto implements DeleteUsersRequestDtoType {
  @ApiProperty({
    description: 'Ids of the users',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUuid({ each: true })
  @IsDefined()
  ids: string[];
}

type UpdateUserRequestDtoType = UserIdRequestDtoType &
  Partial<
    Omit<
      CreateUserRequestDtoType,
      'password' | 'passwordConfirmation' | 'username'
    >
  >;

export class UpdateUserRequestDto implements UpdateUserRequestDtoType {
  @ApiProperty({
    description: 'Id of the user',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;

  @ApiProperty({
    description: 'Is user an admin',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  isAdmin?: boolean;

  @ApiProperty({
    description: 'Can user update data (overwritten by isAdmin)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  canUpdate?: boolean;

  @ApiProperty({
    description: 'Can user create data (overwritten by isAdmin)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  canCreate?: boolean;

  @ApiProperty({
    description: 'Can user delete data (overwritten by isAdmin)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  canDelete?: boolean;

  @ApiProperty({
    description: 'Can user read data (overwritten by isAdmin)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  canRead?: boolean;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  name?: string;
}

type UpdateUserCredentialsRequestDtoType = Pick<
  Prisma.$UserPayload['scalars'],
  'id' | 'username' | 'password'
> &
  PasswordConfirmationDtoType;

export class UpdateUserCredentialsRequestDto
  implements UpdateUserCredentialsRequestDtoType
{
  @ApiProperty({
    description: 'Id of the user',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;

  @ApiProperty({
    description: 'Username for login (unique)',
    example: 'johndoe',
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'strongPassword123!',
  })
  @IsString()
  @IsDefined()
  @IsPassword()
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'strongPassword123!',
  })
  @IsString()
  @IsDefined()
  @PasswordsMatch('password')
  passwordConfirmation: string;
}
