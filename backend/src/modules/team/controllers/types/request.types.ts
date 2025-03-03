import {
  IsArray,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DESCRIPTION_MAX_LENGTH } from '@shared/consts';
import { IsUuid } from '@shared/validators/is-uuid.validator';

type CreateTeamRequestDtoType = Omit<
  Prisma.$TeamPayload['scalars'],
  | 'id'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
  | 'createdById'
  | 'editedById'
  | 'voivodeship'
> &
  Partial<Pick<Prisma.$TeamPayload['scalars'], 'description'>>;

export class CreateTeamRequestDto implements CreateTeamRequestDtoType {
  @ApiProperty({
    description: 'Team name',
    example: 'PHU Metal',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Team address',
    example: '123 Main St',
  })
  @IsString()
  @IsDefined()
  address: string;

  @ApiProperty({
    description: 'Team operation range (in kilometers)',
    example: '123.4',
  })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  @IsDefined()
  range: number;

  @ApiProperty({
    description: 'Team description (max length: 1000)',
    example: 'Some fancy shmancy description...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  @IsDefined()
  description?: string;
}

type TeamIdRequestDtoType = Pick<Prisma.$UserPayload['scalars'], 'id'>;

export class TeamIdRequestDto implements TeamIdRequestDtoType {
  @ApiProperty({
    description: 'Id of the team',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;
}

type DeleteTeamsRequestDtoType = {
  ids: Prisma.$TeamPayload['scalars']['id'][];
};

export class DeleteTeamsRequestDto implements DeleteTeamsRequestDtoType {
  @ApiProperty({
    description: 'Ids of the teams',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUuid({ each: true })
  @IsDefined()
  ids: string[];
}

type UpdateTeamRequestDtoType = TeamIdRequestDtoType &
  Partial<CreateTeamRequestDtoType>;

export class UpdateTeamRequestDto implements UpdateTeamRequestDtoType {
  @ApiProperty({
    description: 'Id of the team',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsDefined()
  @IsUuid()
  id: string;

  @ApiProperty({
    description: 'Team name',
    example: 'PHU Metal',
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  name?: string;

  @ApiProperty({
    description: 'Team address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  address?: string;

  @ApiProperty({
    description: 'Team operation range (in kilometers)',
    example: '123.4',
  })
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  @IsDefined()
  range?: number;

  @ApiProperty({
    description: 'Team description (optional) (max length: 1000)',
    example: 'Some fancy shmancy description...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  @IsDefined()
  description?: string;
}
