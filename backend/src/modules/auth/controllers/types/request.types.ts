import { IsDefined, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

type LoginRequestDtoType = Pick<
  Prisma.$UserPayload['scalars'],
  'username' | 'password'
>;

export class LoginRequestDto implements LoginRequestDtoType {
  @ApiProperty({
    description: 'Username for login',
    example: 'super_admin',
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'strongPassword123!',
  })
  @IsString()
  @IsDefined()
  password: string;
}
