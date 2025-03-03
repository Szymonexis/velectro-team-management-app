import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

type LoginResponseDtoType = Omit<
  Prisma.$UserPayload['scalars'],
  'password' | 'isSuperAdmin'
>;

export class LoginResponseDto implements LoginResponseDtoType {
  @ApiProperty({
    description: 'JWT token returned after successful login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'User id',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: 'Information if user is an admin',
    example: true,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Information if user can update records',
    example: true,
  })
  canUpdate: boolean;

  @ApiProperty({
    description: 'Information if user can create records',
    example: true,
  })
  canCreate: boolean;

  @ApiProperty({
    description: 'Information if user can delete records',
    example: true,
  })
  canDelete: boolean;

  @ApiProperty({
    description: 'Information if user can read records',
    example: true,
  })
  canRead: boolean;

  @ApiProperty({
    description: 'Users full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Information when user account was created',
    example: '2024-10-21 09:25:36.782',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Information when user account was updated',
    example: '2024-10-21 09:25:36.782',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Id of the user that created this user',
    example: '00000000-0000-0000-0000-000000000000',
  })
  createdById: string | null;

  @ApiProperty({
    description: 'Id of the user that last edited this user',
    example: '00000000-0000-0000-0000-000000000000',
  })
  editedById: string | null;
}
