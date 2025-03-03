import { ClientResponseDto } from '@client/controllers/types/response.types';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FilterFieldTypes } from '@shared/transformer-functions/helper.types';
import {
  FilterField,
  PaginatedResponseDto,
  PositionResponseDto,
} from '@shared/types/response.types';
import {
  TEAM_FILTER_FIELDS,
  TEAM_SEARCH_FIELDS,
  TEAM_SORT_FIELDS,
  TeamScalarField,
  TeamScalarFilterFieldType,
} from '@team/shared/team-query-params.helper';

type SimplifiedTeamResponseDtoType = Pick<
  Prisma.$TeamPayload['scalars'],
  'id' | 'name' | 'address' | 'range' | 'voivodeship'
> & {
  position: PositionResponseDto;
  clients: string[];
};

export class SimplifiedTeamResponseDto
  implements SimplifiedTeamResponseDtoType
{
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the team',
  })
  id: string;

  @ApiProperty({
    description: 'Team name',
    example: 'PHU Metal',
  })
  name: string;

  @ApiProperty({
    description: 'Team address',
    example: '123 Main St',
  })
  address: string;

  @ApiProperty({
    description: 'Team operation range (in kilometers)',
    example: '123.4',
  })
  range: number;

  @ApiProperty({
    description: 'Team voivodeship',
    example: 'Województwo mazowieckie',
    type: [String, null],
  })
  voivodeship: string | null;

  @ApiProperty({
    description: 'List of clients that belong to this team',
    type: [String],
  })
  clients: string[];

  @ApiProperty({
    description: 'The lat and lng position of the client',
    type: PositionResponseDto,
  })
  position: PositionResponseDto;
}

type SimplifiedTeamArrayResponseDtoType = {
  teams: SimplifiedTeamResponseDto[];
};

export class SimplifiedTeamArrayResponseDto
  implements SimplifiedTeamArrayResponseDtoType
{
  @ApiProperty({
    type: [SimplifiedTeamResponseDto],
    description: 'The list of simplified teams - to be used for maps purposes',
  })
  teams: SimplifiedTeamResponseDto[];
}

type MinimalTeamResponseDtoType = Pick<
  Prisma.$TeamPayload['scalars'],
  'id' | 'name'
>;

export class MinimalTeamResponseDto implements MinimalTeamResponseDtoType {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the team',
  })
  id: string;

  @ApiProperty({
    description: 'Team name',
    example: 'PHU Metal',
  })
  name: string;
}

type MinimalTeamArrayResponseDtoType = {
  teams: MinimalTeamResponseDto[];
};

export class MinimalTeamArrayResponseDto
  implements MinimalTeamArrayResponseDtoType
{
  @ApiProperty({
    type: [MinimalTeamResponseDto],
    description: 'The list of teams',
  })
  teams: MinimalTeamResponseDto[];
}

type TeamResponseDtoType = Prisma.$TeamPayload['scalars'];

export class TeamResponseDto implements TeamResponseDtoType {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the team',
  })
  id: string;

  @ApiProperty({
    description: 'Team name',
    example: 'PHU Metal',
  })
  name: string;

  @ApiProperty({
    description: 'Team address',
    example: '123 Main St',
  })
  address: string;

  @ApiProperty({
    description: 'Team voivodeship',
    example: 'Województwo mazowieckie',
    type: [String, null],
  })
  voivodeship: string | null;

  @ApiProperty({
    description: 'Team operation range (in kilometers)',
    example: '123.4',
  })
  range: number;

  @ApiProperty({
    description: 'Team description',
    example: 'Some fancy shmancy description...',
    type: [String, null],
  })
  description: string | null;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The createdAt date of the team',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The updatedAt date of the team',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user that created the team',
  })
  createdById: string | null;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user that last edited the team',
  })
  editedById: string | null;
}

type DetailedTeamResponseDtoType = TeamResponseDto & {
  clients: ClientResponseDto[];
};

export class DetailedTeamResponseDto
  extends TeamResponseDto
  implements DetailedTeamResponseDtoType
{
  @ApiProperty({
    description: 'List of clients that belong to this team',
    type: [ClientResponseDto],
  })
  clients: ClientResponseDto[];
}

type TeamArrayResponseDtoType = {
  teams: TeamResponseDto[];
};

export class TeamArrayResponseDto implements TeamArrayResponseDtoType {
  @ApiProperty({
    type: [TeamResponseDto],
    description: 'The list of teams',
  })
  teams: TeamResponseDto[];
}

type TeamArrayPaginatedResponseDtoType = PaginatedResponseDto &
  TeamArrayResponseDtoType;

export class TeamArrayPaginatedResponseDto
  extends PaginatedResponseDto
  implements TeamArrayPaginatedResponseDtoType
{
  @ApiProperty({
    type: [TeamResponseDto],
    description: 'The list of teams',
  })
  teams: TeamResponseDto[];

  @ApiProperty({
    example: TEAM_FILTER_FIELDS,
    description: 'Array of filter fields',
  })
  filterFields: FilterField<TeamScalarFilterFieldType, FilterFieldTypes>[];

  @ApiProperty({
    example: TEAM_SORT_FIELDS,
    description: 'Array of sort fields',
  })
  sortFields: TeamScalarField[];

  @ApiProperty({
    example: TEAM_SEARCH_FIELDS,
    description: 'Array of search fields',
  })
  searchFields: TeamScalarField[];
}
