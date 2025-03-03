import { AuthorizedRequest } from '@auth/types/auth.types';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CanReadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const user = request.user;

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (user.canRead || user.isAdmin || user.isSuperAdmin) {
      return true;
    }

    throw new HttpException(
      "Unauthorized - you don't have permission to read",
      HttpStatus.UNAUTHORIZED,
    );
  }
}
