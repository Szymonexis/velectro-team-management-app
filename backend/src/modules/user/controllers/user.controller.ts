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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '@shared/guards/admin.guard';
import { AuthGuard } from '@shared/guards/auth.guard';
import { PaginationRequestDto } from '@shared/types/request.types';
import { getJointResponseDescription } from '@shared/utils/get-joint-response-description';
import { UserService } from '@user/services/user.service';

import {
  CreateUserRequestDto,
  DeleteUsersRequestDto,
  UpdateUserCredentialsRequestDto,
  UpdateUserRequestDto,
  UserIdRequestDto,
} from './types/request.types';
import {
  UserArrayPaginatedResponseDto,
  UserArrayResponseDto,
  UserResponseDto,
} from './types/response.types';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserArrayPaginatedResponseDto,
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
    description: 'Search term to filter users by name or username',
    example: 'John Doe',
  })
  @ApiQuery({
    name: 'filters',
    required: false,
    type: [String],
    description: 'Array of filters in "fieldName=value" format',
    example: ['canCreate=false', 'canDelete=false'],
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
      'Number of users to return per page. Valid values: 10, 25, 50, 100',
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
  @UseGuards(AuthGuard, AdminGuard)
  getUsers(
    @Req() { user }: AuthorizedRequest,
    @Query() query: PaginationRequestDto,
  ): Promise<UserArrayPaginatedResponseDto> {
    return this.userService.getUsers(user.id, query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponseDto,
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
  @ApiForbiddenResponse({
    description: getJointResponseDescription(['Operation not allowed']),
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    example: '00000000-0000-0000-0000-000000000000',
    type: String,
  })
  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  getUserById(
    @Param() userIdRequestDto: UserIdRequestDto,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(userIdRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponseDto,
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
  @UseGuards(AuthGuard, AdminGuard)
  createUser(
    @Req() req: AuthorizedRequest,
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const reqUserId = req.user.id;

    return this.userService.createUser(reqUserId, createUserRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponseDto,
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
  @ApiForbiddenResponse({
    description: getJointResponseDescription(['Operation not allowed']),
  })
  @Patch()
  @UseGuards(AuthGuard, AdminGuard)
  updateUser(
    @Req() req: AuthorizedRequest,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const reqUserId = req.user.id;

    return this.userService.updateUser(reqUserId, updateUserRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponseDto,
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
  @ApiForbiddenResponse({
    description: getJointResponseDescription(['Operation not allowed']),
  })
  @Patch('credentials')
  @UseGuards(AuthGuard, AdminGuard)
  updateUserCredentials(
    @Req() req: AuthorizedRequest,
    @Body() updateUserCredentialsRequestDto: UpdateUserCredentialsRequestDto,
  ): Promise<UserResponseDto> {
    const reqUserId = req.user.id;

    return this.userService.updateUserCredentials(
      reqUserId,
      updateUserCredentialsRequestDto,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserResponseDto,
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
  @ApiForbiddenResponse({
    description: getJointResponseDescription(['Operation not allowed']),
  })
  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  deleteUser(
    @Req() req: AuthorizedRequest,
    @Param() userIdRequestDto: UserIdRequestDto,
  ): Promise<UserResponseDto> {
    const reqUserId = req.user.id;

    return this.userService.deleteUser(reqUserId, userIdRequestDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserArrayResponseDto,
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
  @ApiForbiddenResponse({
    description: getJointResponseDescription(['Operation not allowed']),
  })
  @Delete()
  @UseGuards(AuthGuard, AdminGuard)
  async deleteUsers(
    @Req() req: AuthorizedRequest,
    @Body() deleteUsersDto: DeleteUsersRequestDto,
  ): Promise<UserArrayResponseDto> {
    const reqUserId = req.user.id;

    return this.userService.deleteUsers(reqUserId, deleteUsersDto);
  }
}
