import { AuthService } from '@auth/services/auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@shared/guards/auth.guard';
import { getJointResponseDescription } from '@shared/utils/get-joint-response-description';

import { AuthorizedRequest } from '../types/auth.types';
import { LoginRequestDto } from './types/request.types';
import { LoginResponseDto } from './types/response.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription(['Invalid credentials']),
  })
  @ApiBadRequestResponse({
    description: getJointResponseDescription(['Username not found']),
  })
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: getJointResponseDescription([
      'Missing or invalid authentication header',
      'Invalid token',
    ]),
  })
  @Get('refresh-token')
  @UseGuards(AuthGuard)
  async refreshToken(@Req() req: AuthorizedRequest): Promise<LoginResponseDto> {
    return this.authService.refreshToken(req.user.id);
  }
}
