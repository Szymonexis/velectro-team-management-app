import { isNil } from 'lodash';

import {
  SimplifiedClientSelect,
  TRAFFIC_LIGHT,
} from '@client/controllers/types/helper.types';
import {
  ClientIdRequestDto,
  CreateClientRequestDto,
  DeleteClientsRequestDto,
  UpdateClientRequestDto,
} from '@client/controllers/types/request.types';
import {
  ClientArrayPaginatedResponseDto,
  ClientArrayResponseDto,
  ClientResponseDto,
  DetailedClientResponseDto,
  SimplifiedClientArrayResponseDto,
} from '@client/controllers/types/response.types';
import {
  CLIENT_DEFAULT_SORT_FIELD,
  CLIENT_FILTER_FIELDS,
  CLIENT_FILTER_FIELDS_TRANSFORMERS,
  CLIENT_SEARCH_FIELDS,
  CLIENT_SORT_FIELDS,
} from '@client/shared/client-query-params.helper';
import { INVOICE_DURATION } from '@client/shared/client.consts';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GoogleMapsService } from '@shared/services/google-maps.service';
import { PrismaService } from '@shared/services/prisma.service';
import { PaginationRequestDto } from '@shared/types/request.types';
import { getPaginationValues } from '@shared/utils/get-pagination-values';
import { parseFilters } from '@shared/utils/parse-filters';
import { parseSorters } from '@shared/utils/parse-sorters';

@Injectable()
export class ClientService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async getAllMapClients(): Promise<SimplifiedClientArrayResponseDto> {
    try {
      const keys: (keyof SimplifiedClientSelect)[] = [
        'id',
        'name',
        'address',
        'invoiceAcceptanceDate',
        'invoiceEndDate',
        'invoiceIsDone',
        'voivodeship',
      ];

      const select = keys.reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as SimplifiedClientSelect,
      );

      const dbClients = await this.prismaService.client.findMany({
        select: {
          ...select,
          team: {
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
        where: {
          showOnMap: true,
        },
      });

      const clients = dbClients
        .filter(({ position }) => !isNil(position))
        .map<SimplifiedClientArrayResponseDto['clients'][number]>(
          ({ team, position, ...client }) => ({
            ...client,
            trafficLight: this._getClientTrafficLight(client),
            position: position!,
            team: team?.name ?? null,
          }),
        );

      return { clients };
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

  async getClients({
    pageIndex,
    pageSize,
    search,
    filters,
    sorters,
  }: PaginationRequestDto): Promise<ClientArrayPaginatedResponseDto> {
    const where = this._getClientsWhere({
      filters,
      search,
    });

    const orderBy = this._getClientsOrderBy({ sorters });

    try {
      const dbClientsCount = await this.prismaService.client.count({ where });

      const { skip, take, correctedPageIndex } = getPaginationValues({
        pageIndex,
        pageSize,
        totalCount: dbClientsCount,
      });

      const dbClients = await this.prismaService.client.findMany({
        where,
        orderBy,
        skip,
        take,
      });

      return {
        clients: dbClients,
        pageIndex: correctedPageIndex,
        pageSize,
        totalCount: dbClientsCount,
        filterFields: CLIENT_FILTER_FIELDS,
        sortFields: CLIENT_SORT_FIELDS,
        searchFields: CLIENT_SEARCH_FIELDS,
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

  async getClientById({
    id,
  }: ClientIdRequestDto): Promise<DetailedClientResponseDto> {
    try {
      const dbClient = await this.prismaService.client.findUnique({
        where: {
          id,
        },
        include: {
          team: true,
        },
      });

      if (!dbClient) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

      return dbClient;
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

  async createClient(
    reqUserId: string,
    {
      invoiceAcceptanceDate,
      invoiceIsDone: providedInvoiceIsDone,
      teamId,
      ...createClientRequestDto
    }: CreateClientRequestDto,
  ): Promise<ClientResponseDto> {
    try {
      const { voivodeship, position } = await this.googleMapsService.geocode(
        createClientRequestDto.address,
      );

      let invoiceEndDate: Date | null = null;
      let invoiceIsDone = false;

      if (!isNil(invoiceAcceptanceDate)) {
        invoiceEndDate = new Date(
          new Date(invoiceAcceptanceDate).getTime() + INVOICE_DURATION,
        );
        invoiceIsDone = providedInvoiceIsDone;
      }

      let dbPositionId: string | null = null;
      if (!isNil(position)) {
        const dbPosition = await this.prismaService.position.create({
          data: position,
        });

        dbPositionId = dbPosition.id;
      }

      const dbClient = await this.prismaService.client.create({
        data: {
          ...createClientRequestDto,
          invoiceAcceptanceDate,
          invoiceEndDate,
          invoiceIsDone,
          voivodeship,
          position: dbPositionId
            ? { connect: { id: dbPositionId } }
            : undefined,
          team: teamId ? { connect: { id: teamId } } : undefined,
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

      return dbClient;
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

  async updateClient(
    reqUserId: string,
    {
      id,
      invoiceAcceptanceDate,
      invoiceIsDone: providedInvoiceIsDone,
      teamId,
      ...updateClientRequestDto
    }: UpdateClientRequestDto,
  ): Promise<ClientResponseDto> {
    try {
      const dbExistingClient = await this.prismaService.client.findUnique({
        where: {
          id,
        },
        include: {
          position: true,
        },
      });

      let invoiceEndDate: Date | null = null;
      let invoiceIsDone = dbExistingClient?.invoiceIsDone ?? false;

      if (!isNil(invoiceAcceptanceDate)) {
        invoiceEndDate = new Date(
          new Date(invoiceAcceptanceDate).getTime() + INVOICE_DURATION,
        );

        if (!isNil(providedInvoiceIsDone)) {
          invoiceIsDone = providedInvoiceIsDone;
        }
      }

      let voivodeship = dbExistingClient?.voivodeship ?? null;
      let dbPositionId = dbExistingClient?.position?.id ?? null;

      if (isNil(updateClientRequestDto.address)) {
        voivodeship = null;
        dbPositionId = null;
      } else if (dbExistingClient?.address !== updateClientRequestDto.address) {
        const { voivodeship: newVoivodeship, position: newPosition } =
          await this.googleMapsService.geocode(updateClientRequestDto.address);

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
        !isNil(dbExistingClient?.position?.id) &&
        dbExistingClient.position.id !== dbPositionId
      ) {
        await this.prismaService.position.delete({
          where: {
            id: dbExistingClient.position.id,
          },
        });
      }

      const dbClient = await this.prismaService.client.update({
        where: {
          id,
        },
        data: {
          ...updateClientRequestDto,
          voivodeship,
          invoiceAcceptanceDate,
          invoiceEndDate,
          invoiceIsDone,
          position: dbPositionId
            ? { connect: { id: dbPositionId } }
            : { disconnect: true },
          team: teamId ? { connect: { id: teamId } } : { disconnect: true },
          editedBy: {
            connect: {
              id: reqUserId,
            },
          },
        },
      });

      return dbClient;
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

  async deleteClient({ id }: ClientIdRequestDto): Promise<ClientResponseDto> {
    try {
      const dbClient = await this.prismaService.client.delete({
        where: {
          id,
        },
      });

      return dbClient;
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

  async deleteClients({
    ids,
  }: DeleteClientsRequestDto): Promise<ClientArrayResponseDto> {
    const clients = await Promise.all(
      ids.map((id) => this.deleteClient({ id })),
    );

    return { clients };
  }

  private _getClientTrafficLight({
    invoiceAcceptanceDate,
    invoiceEndDate,
    invoiceIsDone,
  }: Pick<
    Prisma.$ClientPayload['scalars'],
    'invoiceAcceptanceDate' | 'invoiceEndDate' | 'invoiceIsDone'
  >): TRAFFIC_LIGHT {
    if (
      isNil(invoiceAcceptanceDate) ||
      isNil(invoiceEndDate) ||
      invoiceIsDone
    ) {
      return TRAFFIC_LIGHT.NONE;
    }

    const acceptanceTime = invoiceAcceptanceDate.getTime();
    const endTime = invoiceEndDate.getTime();
    const diff = endTime - acceptanceTime;
    const currentTime = new Date().getTime();

    switch (true) {
      case acceptanceTime <= currentTime &&
        acceptanceTime + diff / 3 > currentTime:
        return TRAFFIC_LIGHT.GREEN;

      case acceptanceTime + diff / 3 <= currentTime &&
        acceptanceTime + (diff / 3) * 2 > currentTime:
        return TRAFFIC_LIGHT.YELLOW;

      case acceptanceTime + (diff / 3) * 2 <= currentTime:
        return TRAFFIC_LIGHT.RED;

      default:
        return TRAFFIC_LIGHT.NONE;
    }
  }

  private _getClientsOrderBy({
    sorters: sortersString,
  }: Pick<
    PaginationRequestDto,
    'sorters'
  >): Prisma.TeamOrderByWithRelationInput[] {
    try {
      const sorters = parseSorters(
        sortersString,
        CLIENT_SORT_FIELDS,
        CLIENT_DEFAULT_SORT_FIELD,
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

  private _getClientsWhere({
    filters: filtersString,
    search,
  }: Pick<
    PaginationRequestDto,
    'filters' | 'search'
  >): Prisma.ClientWhereInput {
    try {
      const where: Prisma.ClientWhereInput = {};

      const filters = parseFilters(
        filtersString,
        CLIENT_FILTER_FIELDS_TRANSFORMERS,
      );

      for (const filterKey of Object.keys(filters)) {
        where[filterKey] = filters[filterKey];
      }

      if (search) {
        where.OR = [];

        for (const searchField of CLIENT_SEARCH_FIELDS) {
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
