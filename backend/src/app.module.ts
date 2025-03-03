import { AuthModule } from '@auth/auth.module';
import { ClientModule } from '@client/client.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { TeamModule } from '@team/team.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      // can't use EnvService here easily so gonna leave it like this, until we find a better solution
      secret: process.env.JWT_SECRET,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    TeamModule,
    ClientModule,
  ],
})
export class AppModule {}
