import { AuthorizedRequest } from '@auth/types/auth.types';
import { ClientService } from '@client/services/client.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@shared/guards/auth.guard';
import { CanCreateGuard } from '@shared/guards/can-create.guard';
import { CanDeleteGuard } from '@shared/guards/can-delete.guard';
import { CanReadGuard } from '@shared/guards/can-read.guard';
import { CanUpdateGuard } from '@shared/guards/can-update.guard';
import { PaginationRequestDto } from '@shared/types/request.types';
import { getJointResponseDescription } from '@shared/utils/get-joint-response-description';

import {
  ClientIdRequestDto,
  CreateClientRequestDto,
  DeleteClientsRequestDto,
  UpdateClientRequestDto,
} from './types/request.types';
import {
  ClientArrayPaginatedResponseDto,
  ClientArrayResponseDto,
  ClientResponseDto,
  DetailedClientResponseDto,
  SimplifiedClientArrayResponseDto,
} from './types/response.types';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: SimplifiedClientArrayResponseDto,
    description:
      'Returns an array of simplified client objects - to be used for maps purposes',
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @Get('all/map')
  @UseGuards(AuthGuard, CanReadGuard)
  getAllMapClients(): Promise<SimplifiedClientArrayResponseDto> {
    return this.clientService.getAllMapClients();
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ClientArrayPaginatedResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @ApiBadRequestResponse({
    description: getJointResponseDescription([
      'Invalid sorters',
      'Invalid filters',
    ]),
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term to filter clients',
    example: 'John Doe',
  })
  @ApiQuery({
    name: 'filters',
    required: false,
    type: [String],
    description: 'Array of filters in "fieldName=value" format',
    example: [],
  })
  @ApiQuery({
    name: 'sorters',
    required: false,
    type: [String],
    description: 'Array of sorters in "fieldName" or "-fieldName" format',
    example: ['createdAt'],
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description:
      'Number of clients to return per page. Valid values: 10, 25, 50, 100',
    example: 25,
  })
  @ApiQuery({
    name: 'pageIndex',
    required: false,
    type: Number,
    description: 'Page number to retrieve (starting from 0)',
    example: 0,
  })
  @Get()
  @UseGuards(AuthGuard, CanReadGuard)
  getClients(
    @Query() query: PaginationRequestDto,
  ): Promise<ClientArrayPaginatedResponseDto> {
    return this.clientService.getClients(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: DetailedClientResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    example: '00000000-0000-0000-0000-000000000000',
    type: String,
  })
  @Get(':id')
  @UseGuards(AuthGuard, CanReadGuard)
  getClientById(
    @Param() clientIdRequestDto: ClientIdRequestDto,
  ): Promise<DetailedClientResponseDto> {
    return this.clientService.getClientById(clientIdRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ClientResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @Post()
  @UseGuards(AuthGuard, CanCreateGuard)
  createClient(
    @Req() req: AuthorizedRequest,
    @Body() createClientRequestDto: CreateClientRequestDto,
  ): Promise<ClientResponseDto> {
    const reqUserId = req.user.id;

    return this.clientService.createClient(reqUserId, createClientRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ClientResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @Patch()
  @UseGuards(AuthGuard, CanUpdateGuard)
  updateClient(
    @Req() req: AuthorizedRequest,
    @Body() updateClientRequestDto: UpdateClientRequestDto,
  ): Promise<ClientResponseDto> {
    const reqUserId = req.user.id;

    return this.clientService.updateClient(reqUserId, updateClientRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ClientResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @Delete(':id')
  @UseGuards(AuthGuard, CanDeleteGuard)
  deleteClient(
    @Param() clientIdRequestDto: ClientIdRequestDto,
  ): Promise<ClientResponseDto> {
    return this.clientService.deleteClient(clientIdRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ClientArrayResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Unauthorized',
      'Unauthorized - you are not admin',
      'Invalid token',
    ]),
  })
  @ApiInternalServerErrorResponse({
    description: getJointResponseDescription(['Internal server error']),
  })
  @Delete()
  @UseGuards(AuthGuard, CanDeleteGuard)
  deleteClients(
    @Body() deleteClientsRequestDto: DeleteClientsRequestDto,
  ): Promise<ClientArrayResponseDto> {
    return this.clientService.deleteClients(deleteClientsRequestDto);
  }
}
