import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { PrismaService } from 'src/shared/services/prisma.service';

import { JwtPayload } from '@auth/types/auth.types';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EnvKeys, EnvService } from '@shared/services/env.service';

import { LoginRequestDto } from '../controllers/types/request.types';
import { LoginResponseDto } from '../controllers/types/response.types';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this._registerSuperAdmin();
  }

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const dbUser = await this.prismaService.user.findUnique({
      where: {
        username: loginDto.username,
      },
    });

    if (!dbUser) {
      throw new HttpException('Username not found', HttpStatus.BAD_REQUEST);
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const jwtPayload: JwtPayload = {
      id: dbUser.id,
      exp: Date.now() + Number(this.envService.get(EnvKeys.JWT_EXPIRATION)),
    };
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.envService.get(EnvKeys.JWT_SECRET),
    });

    return {
      token,
      ...omit(dbUser, ['password']),
    };
  }

  async refreshToken(userId: string): Promise<LoginResponseDto> {
    const dbUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      throw new HttpException('Username not found', HttpStatus.BAD_REQUEST);
    }

    const jwtPayload: JwtPayload = {
      id: userId,
      exp: Date.now() + Number(this.envService.get(EnvKeys.JWT_EXPIRATION)),
    };
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.envService.get(EnvKeys.JWT_SECRET),
    });

    return {
      token,
      ...omit(dbUser, ['password']),
    };
  }

  private async _registerSuperAdmin(): Promise<void> {
    const password = this.envService.get(EnvKeys.SUPER_ADMIN_PASSWORD);
    const username = this.envService.get(EnvKeys.SUPER_ADMIN_USERNAME);
    const id = this.envService.get(EnvKeys.SUPER_ADMIN_ID);
    const bcryptSaltRounds = Number(
      this.envService.get(EnvKeys.BECRYPT_SALT_ROUNDS),
    );

    const passwordHash = await bcrypt.hash(password, bcryptSaltRounds);

    const superAdmin = {
      id,
      username,
      name: 'Super Admin',
      password: passwordHash,
      isSuperAdmin: true,
      isAdmin: true,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
    };

    try {
      const dbUser = await this.prismaService.user.upsert({
        where: { id },
        create: {
          ...superAdmin,
        },
        update: {
          ...superAdmin,
        },
      });

      if (!dbUser) {
        throw new Error('Unable to create super user');
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Username already exists');
        } else {
          throw new Error('Unable to create super user - unknown error');
        }
      }
    }
  }
}
