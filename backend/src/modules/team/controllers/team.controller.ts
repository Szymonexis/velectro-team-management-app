import { AuthorizedRequest } from '@auth/types/auth.types';
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
import { TeamService } from '@team/services/team.service';

import {
  CreateTeamRequestDto,
  DeleteTeamsRequestDto,
  TeamIdRequestDto,
  UpdateTeamRequestDto,
} from './types/request.types';
import {
  DetailedTeamResponseDto,
  MinimalTeamArrayResponseDto,
  SimplifiedTeamArrayResponseDto,
  TeamArrayPaginatedResponseDto,
  TeamArrayResponseDto,
  TeamResponseDto,
} from './types/response.types';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: SimplifiedTeamArrayResponseDto,
    description:
      'Returns an array of simplified team objects - to be used for maps purposes',
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
  getAllMapTeams(): Promise<SimplifiedTeamArrayResponseDto> {
    return this.teamService.getAllMapTeams();
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: MinimalTeamArrayResponseDto,
    description:
      'Returns an array of minimal team objects - to be used with clients join',
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
  @Get('minimal')
  @UseGuards(AuthGuard, CanReadGuard)
  getMinimalTeams(): Promise<MinimalTeamArrayResponseDto> {
    return this.teamService.getMinimalTeams();
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: TeamArrayPaginatedResponseDto,
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
    description: 'Search term to filter teams',
    example: 'John Doe',
  })
  @ApiQuery({
    name: 'filters',
    required: false,
    type: [String],
    description: 'Array of filters in "fieldName=value" format',
    example: ['range=0:10'],
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
      'Number of teams to return per page. Valid values: 10, 25, 50, 100',
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
  getTeams(
    @Query() query: PaginationRequestDto,
  ): Promise<TeamArrayPaginatedResponseDto> {
    return this.teamService.getTeams(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: DetailedTeamResponseDto,
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
  getTeamById(
    @Param() teamIdRequestDto: TeamIdRequestDto,
  ): Promise<DetailedTeamResponseDto> {
    return this.teamService.getTeamById(teamIdRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: TeamResponseDto,
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
  createTeam(
    @Req() req: AuthorizedRequest,
    @Body() createTeamRequestDto: CreateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    const reqUserId = req.user.id;

    return this.teamService.createTeam(reqUserId, createTeamRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: TeamResponseDto,
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
  updateTeam(
    @Req() req: AuthorizedRequest,
    @Body() updateTeamRequestDto: UpdateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    const reqUserId = req.user.id;

    return this.teamService.updateTeam(reqUserId, updateTeamRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: TeamResponseDto,
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
  deleteTeam(
    @Param() teamIdRequestDto: TeamIdRequestDto,
  ): Promise<TeamResponseDto> {
    return this.teamService.deleteTeam(teamIdRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: TeamArrayResponseDto,
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
  deleteTeams(
    @Body() deleteTeamsRequestDto: DeleteTeamsRequestDto,
  ): Promise<TeamArrayResponseDto> {
    return this.teamService.deleteTeams(deleteTeamsRequestDto);
  }
}
