import { isNil } from 'lodash';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GoogleMapsService } from '@shared/services/google-maps.service';
import { PrismaService } from '@shared/services/prisma.service';
import { PaginationRequestDto } from '@shared/types/request.types';
import { getPaginationValues } from '@shared/utils/get-pagination-values';
import { parseFilters } from '@shared/utils/parse-filters';
import { parseSorters } from '@shared/utils/parse-sorters';
import { SimplifiedTeamSelect } from '@team/controllers/types/helper.types';
import {
  CreateTeamRequestDto,
  DeleteTeamsRequestDto,
  TeamIdRequestDto,
  UpdateTeamRequestDto,
} from '@team/controllers/types/request.types';
import {
  DetailedTeamResponseDto,
  MinimalTeamArrayResponseDto,
  SimplifiedTeamArrayResponseDto,
  TeamArrayPaginatedResponseDto,
  TeamArrayResponseDto,
  TeamResponseDto,
} from '@team/controllers/types/response.types';
import {
  TEAM_DEFAULT_SORT_FIELD,
  TEAM_FILTER_FIELDS,
  TEAM_FILTER_FIELDS_TRANSFORMERS,
  TEAM_SEARCH_FIELDS,
  TEAM_SORT_FIELDS,
} from '@team/shared/team-query-params.helper';

@Injectable()
export class TeamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async getAllMapTeams(): Promise<SimplifiedTeamArrayResponseDto> {
    try {
      const keys: (keyof SimplifiedTeamSelect)[] = [
        'id',
        'name',
        'address',
        'range',
        'voivodeship',
      ];

      const select = keys.reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as SimplifiedTeamSelect,
      );

      const dbTeams = await this.prismaService.team.findMany({
        select: {
          ...select,
          clients: {
            select: {
              name: true,
            },
          },
          position: {
            select: {
              lat: true,
              lng: true,
            },
          },
        },
      });

      const teams = dbTeams
        .filter(({ position }) => !isNil(position))
        .map<SimplifiedTeamArrayResponseDto['teams'][number]>(
          ({ position, ...team }) => ({
            ...team,
            position: position!,
            clients: team.clients.map((client) => client.name),
          }),
        );

      return { teams };
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

  async getMinimalTeams(): Promise<MinimalTeamArrayResponseDto> {
    try {
      const dbTeams = await this.prismaService.team.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return { teams: dbTeams };
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

  async getTeams({
    pageIndex,
    pageSize,
    search,
    filters,
    sorters,
  }: PaginationRequestDto): Promise<TeamArrayPaginatedResponseDto> {
    const where = this._getTeamsWhere({
      filters,
      search,
    });

    const orderBy = this._getTeamsOrderBy({ sorters });

    try {
      const dbTeamsCount = await this.prismaService.team.count({ where });

      const { skip, take, correctedPageIndex } = getPaginationValues({
        pageIndex,
        pageSize,
        totalCount: dbTeamsCount,
      });

      const dbTeams = await this.prismaService.team.findMany({
        where,
        orderBy,
        skip,
        take,
      });

      return {
        teams: dbTeams,
        pageIndex: correctedPageIndex,
        pageSize,
        totalCount: dbTeamsCount,
        filterFields: TEAM_FILTER_FIELDS,
        sortFields: TEAM_SORT_FIELDS,
        searchFields: TEAM_SEARCH_FIELDS,
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

  async getTeamById({
    id,
  }: TeamIdRequestDto): Promise<DetailedTeamResponseDto> {
    try {
      const dbTeam = await this.prismaService.team.findUnique({
        where: {
          id,
        },
        include: {
          clients: true,
        },
      });

      if (!dbTeam) {
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }

      return dbTeam;
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

  async createTeam(
    reqUserId: string,
    createTeamRequestDto: CreateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    try {
      const { voivodeship, position } = await this.googleMapsService.geocode(
        createTeamRequestDto.address,
      );

      let dbPositionId: string | null = null;
      if (!isNil(position)) {
        const dbPosition = await this.prismaService.position.create({
          data: position,
        });

        dbPositionId = dbPosition.id;
      }

      const dbTeam = await this.prismaService.team.create({
        data: {
          ...createTeamRequestDto,
          voivodeship,
          position: dbPositionId
            ? { connect: { id: dbPositionId } }
            : undefined,
          createdBy: {
            connect: {
              id: reqUserId,
            },
          },
          editedBy: {
            connect: {
              id: reqUserId,
            },
          },
        },
      });

      return dbTeam;
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

  async updateTeam(
    reqUserId: string,
    { id, ...updateTeamRequestDto }: UpdateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    try {
      const dbExistingTeam = await this.prismaService.team.findUnique({
        where: {
          id,
        },
        include: {
          position: true,
        },
      });

      let voivodeship = dbExistingTeam?.voivodeship ?? null;
      let dbPositionId = dbExistingTeam?.position?.id ?? null;

      if (isNil(updateTeamRequestDto.address)) {
        voivodeship = null;
        dbPositionId = null;
      } else if (dbExistingTeam?.address !== updateTeamRequestDto.address) {
        const { voivodeship: newVoivodeship, position: newPosition } =
          await this.googleMapsService.geocode(updateTeamRequestDto.address);

        if (!isNil(newPosition)) {
          const dbNewPosition = await this.prismaService.position.create({
            data: newPosition,
          });

          dbPositionId = dbNewPosition.id;
        }

        voivodeship = newVoivodeship;
      }

      // delete old position if it was set and new is different or deleted
      if (
        !isNil(dbExistingTeam?.position?.id) &&
        dbExistingTeam.position.id !== dbPositionId
      ) {
        await this.prismaService.position.delete({
          where: {
            id: dbExistingTeam.position.id,
          },
        });
      }

      const dbTeam = await this.prismaService.team.update({
        where: {
          id,
        },
        data: {
          ...updateTeamRequestDto,
          voivodeship,
          position: dbPositionId
            ? { connect: { id: dbPositionId } }
            : { disconnect: true },
          editedBy: {
            connect: {
              id: reqUserId,
            },
          },
        },
      });

      return dbTeam;
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

  async deleteTeam({ id }: TeamIdRequestDto): Promise<TeamResponseDto> {
    try {
      const dbTeam = await this.prismaService.team.delete({
        where: {
          id,
        },
      });

      return dbTeam;
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

  async deleteTeams({
    ids,
  }: DeleteTeamsRequestDto): Promise<TeamArrayResponseDto> {
    const teams = await Promise.all(ids.map((id) => this.deleteTeam({ id })));

    return { teams };
  }

  // TODO: Refactor this method together with the one in client.service.ts and user.service.ts
  private _getTeamsOrderBy({
    sorters: sortersString,
  }: Pick<
    PaginationRequestDto,
    'sorters'
  >): Prisma.TeamOrderByWithRelationInput[] {
    try {
      const sorters = parseSorters(
        sortersString,
        TEAM_SORT_FIELDS,
        TEAM_DEFAULT_SORT_FIELD,
      );

      const orderBy: Prisma.TeamOrderByWithRelationInput[] = sorters.map(
        ([key, order]) => ({
          [key]: order,
        }),
      );

      return orderBy;
    } catch {
      throw new HttpException('Invalid sorters', HttpStatus.BAD_REQUEST);
    }
  }

  // TODO: Refactor this method together with the one in client.service.ts and user.service.ts
  private _getTeamsWhere({
    filters: filtersString,
    search,
  }: Pick<PaginationRequestDto, 'filters' | 'search'>): Prisma.TeamWhereInput {
    try {
      const where: Prisma.TeamWhereInput = {};

      const filters = parseFilters(
        filtersString,
        TEAM_FILTER_FIELDS_TRANSFORMERS as any,
      );

      for (const filterKey of Object.keys(filters)) {
        where[filterKey] = filters[filterKey];
      }

      if (search) {
        where.OR = [];

        for (const searchField of TEAM_SEARCH_FIELDS) {
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
