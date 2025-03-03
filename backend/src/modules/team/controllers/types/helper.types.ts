import { SimplifiedTeamResponseDto } from './response.types';

export type SimplifiedTeamSelect = {
  [key in keyof SimplifiedTeamResponseDto]: boolean;
};
