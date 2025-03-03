import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DESCRIPTION_MAX_LENGTH } from '@shared/consts';
import { IsUuid } from '@shared/validators/is-uuid.validator';

type CreateClientRequestDtoType = Omit<
  Prisma.$ClientPayload['scalars'],
  | 'id'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
  | 'createdById'
  | 'editedById'
  | 'invoiceEndDate'
  | 'invoiceAcceptanceDate'
  | 'teamId'
  | 'voivodeship'
> &
  Partial<
    Pick<
      Prisma.$ClientPayload['scalars'],
      'description' | 'invoiceAcceptanceDate' | 'teamId'
    >
  >;

export class CreateClientRequestDto implements CreateClientRequestDtoType {
  @ApiProperty({
    description: 'Client name',
    example: 'PHU Metal',
  })
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Client address',
    example: '123 Main St',
  })
  @IsDefined()
  @IsString()
  address: string;

  @ApiProperty({
    description:
      "Invoice done state (when done, invoiceAcceptanceDate can't be changed)",
    example: false,
  })
  @IsDefined()
  @IsBoolean()
  invoiceIsDone: boolean;

  @ApiProperty({
    description:
      "Show on map flag (global) - when set to false, client won't be shown on map for any user",
    example: true,
  })
  @IsDefined()
  @IsBoolean()
  showOnMap: boolean;

  @ApiProperty({
    description: 'Invoice acceptance date',
    example: new Date(Date.now()).toISOString(),
  })
  @IsOptional()
  @IsDefined()
  @IsDateString()
  invoiceAcceptanceDate?: Date;

  @ApiProperty({
    description: 'Client description',
    example: 'Some description',
  })
  @IsOptional()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  @IsString()
  @IsDefined()
  description?: string;

  @ApiProperty({
    description: 'Team ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsOptional()
  @IsDefined()
  @IsUuid()
  teamId?: string;
}

type ClientIdRequestDtoType = Pick<Prisma.$ClientPayload['scalars'], 'id'>;

export class ClientIdRequestDto implements ClientIdRequestDtoType {
  @ApiProperty({
    description: 'Id of the client',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;
}

type DeleteClientsRequestDtoType = {
  ids: Prisma.$ClientPayload['scalars']['id'][];
};

export class DeleteClientsRequestDto implements DeleteClientsRequestDtoType {
  @ApiProperty({
    description: 'Ids of the clients',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUuid({ each: true })
  @IsDefined()
  ids: string[];
}

type UpdateClientRequestDtoType = ClientIdRequestDtoType &
  Partial<CreateClientRequestDtoType>;

export class UpdateClientRequestDto implements UpdateClientRequestDtoType {
  @ApiProperty({
    description: 'Id of the client',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;

  @ApiProperty({
    description: 'Client name',
    example: 'PHU Metal',
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  name?: string;

  @ApiProperty({
    description: 'Client address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  address?: string;

  @ApiProperty({
    description:
      "Invoice done state (when done, invoiceAcceptanceDate can't be changed)",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  invoiceIsDone?: boolean;

  @ApiProperty({
    description:
      "Show on map flag (global) - when set to false, client won't be shown on map for any user",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @IsDefined()
  showOnMap?: boolean;

  @ApiProperty({
    description: 'Client description',
    example: 'Some description',
  })
  @IsOptional()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  @IsString()
  @IsDefined()
  description?: string;

  @ApiProperty({
    description: 'Invoice acceptance date',
    example: new Date(Date.now()).toISOString(),
  })
  @IsOptional()
  @IsDefined()
  @IsDateString()
  invoiceAcceptanceDate?: Date;

  @ApiProperty({
    description: 'Team ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsOptional()
  @IsUuid()
  teamId?: string | null;
}
