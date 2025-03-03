import * as bcrypt from 'bcryptjs';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EnvKeys, EnvService } from '@shared/services/env.service';
import { PrismaService } from '@shared/services/prisma.service';
import { PaginationRequestDto } from '@shared/types/request.types';
import { getPaginationValues } from '@shared/utils/get-pagination-values';
import { parseFilters } from '@shared/utils/parse-filters';
import { parseSorters } from '@shared/utils/parse-sorters';
import {
  CreateUserRequestDto,
  DeleteUsersRequestDto,
  UpdateUserCredentialsRequestDto,
  UpdateUserRequestDto,
  UserIdRequestDto,
} from '@user/controllers/types/request.types';
import {
  getUserResponseDto,
  UserArrayPaginatedResponseDto,
  UserArrayResponseDto,
  UserResponseDto,
} from '@user/controllers/types/response.types';
import {
  USER_DEFAULT_SORT_FIELD,
  USER_FILTER_FIELDS,
  USER_FILTER_FIELDS_TRANSFORMERS,
  USER_SEARCH_FIELDS,
  USER_SORT_FIELDS,
} from '@user/shared/user-query-params.helper';

@Injectable()
export class UserService {
  private readonly _superAdminId = this.envService.get(EnvKeys.SUPER_ADMIN_ID);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
  ) {}

  async getUsers(
    userId: string,
    { pageIndex, pageSize, search, filters, sorters }: PaginationRequestDto,
  ): Promise<UserArrayPaginatedResponseDto> {
    const where = this._getUsersWhere(userId, {
      filters,
      search,
    });

    const orderBy = this._getUsersOrderBy({ sorters });

    try {
      const dbUsersCount = await this.prismaService.user.count({ where });

      const { skip, take, correctedPageIndex } = getPaginationValues({
        pageIndex,
        pageSize,
        totalCount: dbUsersCount,
      });

      const dbUsers = await this.prismaService.user.findMany({
        skip,
        take,
        orderBy,
        where,
      });

      const users = dbUsers.map<UserResponseDto>(getUserResponseDto);

      return {
        users,
        pageIndex: correctedPageIndex,
        pageSize,
        totalCount: dbUsersCount,
        filterFields: USER_FILTER_FIELDS,
        sortFields: USER_SORT_FIELDS,
        searchFields: USER_SEARCH_FIELDS,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById({ id }: UserIdRequestDto): Promise<UserResponseDto> {
    if (id === this._superAdminId) {
      throw new HttpException('Operation not allowed', HttpStatus.FORBIDDEN);
    }

    try {
      const dbUser = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!dbUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const user = getUserResponseDto(dbUser);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(
    reqUserId: string,
    {
      passwordConfirmation: __,
      password,
      ...createUserRequestDto
    }: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const bcryptSaltRounds = Number(
      this.envService.get(EnvKeys.BECRYPT_SALT_ROUNDS),
    );

    const passwordHash = await bcrypt.hash(password, bcryptSaltRounds);

    try {
      const dbUser = await this.prismaService.user.create({
        data: {
          ...createUserRequestDto,
          password: passwordHash,
          createdById: reqUserId,
          editedById: reqUserId,
        },
      });

      const user = getUserResponseDto(dbUser);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    reqUserId: string,
    { id, ...updateUserRequestDto }: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    if (id === this._superAdminId || reqUserId === id) {
      throw new HttpException('Operation not allowed', HttpStatus.FORBIDDEN);
    }

    try {
      const dbUser = await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          editedById: reqUserId,
          ...updateUserRequestDto,
        },
      });

      const user = getUserResponseDto(dbUser);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserCredentials(
    reqUserId: string,
    { id, password, username }: UpdateUserCredentialsRequestDto,
  ): Promise<UserResponseDto> {
    if (id === this._superAdminId || reqUserId === id) {
      throw new HttpException('Operation not allowed', HttpStatus.FORBIDDEN);
    }

    const bcryptSaltRounds = Number(
      this.envService.get(EnvKeys.BECRYPT_SALT_ROUNDS),
    );

    const passwordHash = await bcrypt.hash(password, bcryptSaltRounds);

    try {
      const dbUser = await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          password: passwordHash,
          username,
        },
      });

      const user = getUserResponseDto(dbUser);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(
    reqUserId: string,
    { id }: UserIdRequestDto,
  ): Promise<UserResponseDto> {
    if (id === this._superAdminId || reqUserId === id) {
      throw new HttpException('Operation not allowed', HttpStatus.FORBIDDEN);
    }

    try {
      const dbUser = await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      const user = getUserResponseDto(dbUser);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUsers(
    userId: string,
    { ids }: DeleteUsersRequestDto,
  ): Promise<UserArrayResponseDto> {
    if (userId in ids || this._superAdminId in ids) {
      throw new HttpException('Operation not allowed', HttpStatus.FORBIDDEN);
    }

    const users = await Promise.all(
      ids.map((id) => this.deleteUser(userId, { id })),
    );

    return { users };
  }

  private _getUsersOrderBy({
    sorters: sortersString,
  }: Pick<
    PaginationRequestDto,
    'sorters'
  >): Prisma.UserOrderByWithRelationInput[] {
    try {
      const sorters = parseSorters(
        sortersString,
        USER_SORT_FIELDS,
        USER_DEFAULT_SORT_FIELD,
      );

      const orderBy: Prisma.UserOrderByWithRelationInput[] = sorters.map(
        ([key, order]) => ({
          [key]: order,
        }),
      );

      return orderBy;
    } catch {
      throw new HttpException('Invalid sorters', HttpStatus.BAD_REQUEST);
    }
  }

  private _getUsersWhere(
    userId: string,
    {
      filters: filtersString,
      search,
    }: Pick<PaginationRequestDto, 'filters' | 'search'>,
  ): Prisma.UserWhereInput {
    try {
      const where: Prisma.UserWhereInput = {
        id: {
          notIn: [this._superAdminId, userId],
        },
      };

      const filters = parseFilters(
        filtersString,
        USER_FILTER_FIELDS_TRANSFORMERS as any,
      );

      for (const filterKey of Object.keys(filters)) {
        where[filterKey] = filters[filterKey];
      }

      if (search) {
        where.OR = [];

        for (const searchField of USER_SEARCH_FIELDS) {
          where.OR.push({
            [searchField]: {
              contains: search,
              mode: 'insensitive',
            },
          });
        }
      }

      return where;
    } catch {
      throw new HttpException('Invalid filters', HttpStatus.BAD_REQUEST);
    }
  }
}
