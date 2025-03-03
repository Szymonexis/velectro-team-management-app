import {
  CLIENT_FILTER_FIELDS,
  CLIENT_SEARCH_FIELDS,
  CLIENT_SORT_FIELDS,
  ClientScalarField,
} from '@client/shared/client-query-params.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FilterFieldTypes } from '@shared/transformer-functions/helper.types';
import {
  FilterField,
  PaginatedResponseDto,
  PositionResponseDto,
} from '@shared/types/response.types';
import { TeamResponseDto } from '@team/controllers/types/response.types';

import { TRAFFIC_LIGHT } from './helper.types';

type SimplifiedClientResponseDtoType = Pick<
  Prisma.$ClientPayload['scalars'],
  | 'id'
  | 'name'
  | 'address'
  | 'invoiceAcceptanceDate'
  | 'invoiceEndDate'
  | 'invoiceIsDone'
  | 'voivodeship'
> & {
  trafficLight: TRAFFIC_LIGHT;
  position: PositionResponseDto;
  team: string | null;
};

export class SimplifiedClientResponseDto
  implements SimplifiedClientResponseDtoType
{
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the client',
  })
  id: string;

  @ApiProperty({
    description: 'Client name',
    example: 'PHU Metal',
  })
  name: string;

  @ApiProperty({
    description: 'Client address',
    example: '123 Main St',
  })
  address: string;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The invoiceAcceptanceDate date of the client',
    type: [Date, null],
  })
  invoiceAcceptanceDate: Date | null;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The invoiceEndDate date of the client',
    type: [Date, null],
  })
  invoiceEndDate: Date | null;

  @ApiProperty({
    example: false,
    description: 'The invoiceIsDone status of the client',
  })
  invoiceIsDone: boolean;

  @ApiProperty({
    description: 'Client voivodeship',
    example: 'Województwo dolnośląskie',
    type: [String, null],
  })
  voivodeship: string | null;

  @ApiProperty({
    example: TRAFFIC_LIGHT.NONE,
    description: 'The traffic light status of the client',
  })
  trafficLight: TRAFFIC_LIGHT;

  @ApiProperty({
    example: true,
    description: 'The name of the team associated with this client',
  })
  team: string | null;

  @ApiProperty({
    description: 'The lat and lng position of the client',
    type: PositionResponseDto,
  })
  position: PositionResponseDto;
}

type SimplifiedClientArrayResponseDtoType = {
  clients: SimplifiedClientResponseDto[];
};

export class SimplifiedClientArrayResponseDto
  implements SimplifiedClientArrayResponseDtoType
{
  @ApiProperty({
    type: [SimplifiedClientResponseDto],
    description: 'The list of simplified clients - for map purposes only',
  })
  clients: SimplifiedClientResponseDto[];
}

type ClientResponseDtoType = Prisma.$ClientPayload['scalars'];

export class ClientResponseDto implements ClientResponseDtoType {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the client',
  })
  id: string;

  @ApiProperty({
    description: 'Client name',
    example: 'PHU Metal',
  })
  name: string;

  @ApiProperty({
    description: 'Client description (optional)',
    example: 'Some fancy shmancy description...',
    type: [String, null],
  })
  description: string | null;

  @ApiProperty({
    description: 'Client address',
    example: '123 Main St',
  })
  address: string;

  @ApiProperty({
    description: 'Client voivodeship',
    example: 'Województwo dolnośląskie',
    type: [String, null],
  })
  voivodeship: string | null;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The invoiceAcceptanceDate date of the client',
    type: [Date, null],
  })
  invoiceAcceptanceDate: Date | null;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The invoiceEndDate date of the client',
    type: [Date, null],
  })
  invoiceEndDate: Date | null;

  @ApiProperty({
    example: false,
    description: 'The invoiceIsDone status of the client',
  })
  invoiceIsDone: boolean;

  @ApiProperty({
    example: true,
    description: 'The showOnMap status of the client',
  })
  showOnMap: boolean;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The createdAt date of the client',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-09-27T15:00:00.000Z',
    description: 'The updatedAt date of the client',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the team that this client belongs to',
  })
  teamId: string | null;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user that created this client',
  })
  createdById: string | null;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'The id of the user that last edited this client',
  })
  editedById: string | null;
}

type DetailedClientResponseDtoType = ClientResponseDto & {
  team: TeamResponseDto | null;
};

export class DetailedClientResponseDto
  extends ClientResponseDto
  implements DetailedClientResponseDtoType
{
  @ApiProperty({
    description: 'Client that this client belongs to',
    type: TeamResponseDto,
  })
  team: TeamResponseDto | null;
}

type ClientArrayResponseDtoType = {
  clients: ClientResponseDto[];
};

export class ClientArrayResponseDto implements ClientArrayResponseDtoType {
  @ApiProperty({
    type: [ClientResponseDto],
    description: 'The list of clients',
  })
  clients: ClientResponseDto[];
}

type ClientArrayPaginatedResponseDtoType = PaginatedResponseDto &
  ClientArrayResponseDtoType;

export class ClientArrayPaginatedResponseDto
  extends PaginatedResponseDto
  implements ClientArrayPaginatedResponseDtoType
{
  @ApiProperty({
    type: [ClientResponseDto],
    description: 'The list of clients',
  })
  clients: ClientResponseDto[];

  @ApiProperty({
    example: CLIENT_FILTER_FIELDS,
    description: 'Array of filter fields',
  })
  filterFields: FilterField<string, FilterFieldTypes>[];

  @ApiProperty({
    example: CLIENT_SORT_FIELDS,
    description: 'Array of sort fields',
  })
  sortFields: ClientScalarField[];

  @ApiProperty({
    example: CLIENT_SEARCH_FIELDS,
    description: 'Array of search fields',
  })
  searchFields: ClientScalarField[];
}
