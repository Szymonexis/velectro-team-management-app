import { AuthorizedRequest, JwtPayload } from '@auth/types/auth.types';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvKeys, EnvService } from '@shared/services/env.service';
import { PrismaService } from '@shared/services/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        'Missing or invalid authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = (authHeader as string).split(' ')[1];
    try {
      const { id, exp } = this.jwtService.verify<JwtPayload>(token, {
        secret: this.envService.get(EnvKeys.JWT_SECRET),
      });

      const dbUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!dbUser || exp < Date.now()) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      (request as AuthorizedRequest<any>)['user'] = dbUser;

      return true;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
