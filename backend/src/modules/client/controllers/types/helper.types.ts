import { SimplifiedClientResponseDto } from './response.types';

export type SimplifiedClientSelect = {
  [key in keyof SimplifiedClientResponseDto]: boolean;
};

export enum TRAFFIC_LIGHT {
  NONE = 'NONE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}
