import { Module } from '@nestjs/common';

import { EnvService } from './services/env.service';
import { GoogleMapsService } from './services/google-maps.service';
import { PrismaService } from './services/prisma.service';

const providers = [PrismaService, EnvService, GoogleMapsService];

@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
