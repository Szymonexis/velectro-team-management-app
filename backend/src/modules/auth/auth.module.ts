import { SharedModule } from 'src/shared/shared.module';

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

const providers = [AuthService, JwtService];

const controllers = [AuthController];

const imports = [SharedModule];

@Module({
  imports,
  controllers,
  providers,
})
export class AuthModule {}
