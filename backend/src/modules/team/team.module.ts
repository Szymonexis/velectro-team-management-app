import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';

import { TeamController } from './controllers/team.controller';
import { TeamService } from './services/team.service';

const providers = [TeamService, JwtService];

const imports = [SharedModule];

const controllers = [TeamController];

@Module({
  imports,
  controllers,
  providers,
})
export class TeamModule {}
