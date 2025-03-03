import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';

import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';

const providers = [ClientService, JwtService];

const imports = [SharedModule];

const controllers = [ClientController];

@Module({
  imports,
  controllers,
  providers,
})
export class ClientModule {}
