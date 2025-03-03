import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

const providers = [UserService, JwtService];

const imports = [SharedModule];

const controllers = [UserController];

@Module({
  imports,
  controllers,
  providers,
})
export class UserModule {}
