import { Request } from 'express';

import { Prisma } from '@prisma/client';

export type JwtPayload = Pick<Prisma.$UserPayload['scalars'], 'id'> & {
  exp: number;
};

export type AuthorizedRequest<T extends Request = Request> = T & {
  user: Prisma.$UserPayload['scalars'];
};
