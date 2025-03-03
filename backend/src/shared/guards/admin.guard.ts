import { AuthorizedRequest } from '@auth/types/auth.types';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const user = request.user;

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (user.isAdmin || user.isSuperAdmin) {
      return true;
    }

    throw new HttpException(
      'Unauthorized - you are not admin',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
