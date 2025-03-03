import { isNil } from 'lodash';

import { Injectable } from '@nestjs/common';

export enum EnvKeys {
  POSTGRES_USER = 'POSTGRES_USER',
  POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
  POSTGRES_DB = 'POSTGRES_DB',
  POSTGRES_PORT = 'POSTGRES_PORT',
  DATABASE_URL = 'DATABASE_URL',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRATION = 'JWT_EXPIRATION',
  BECRYPT_SALT_ROUNDS = 'BECRYPT_SALT_ROUNDS',
  SUPER_ADMIN_USERNAME = 'SUPER_ADMIN_USERNAME',
  SUPER_ADMIN_PASSWORD = 'SUPER_ADMIN_PASSWORD',
  SUPER_ADMIN_ID = 'SUPER_ADMIN_ID',
  GOOGLE_MAPS_PLATFORM_API_KEY = 'GOOGLE_MAPS_PLATFORM_API_KEY',
}

@Injectable()
export class EnvService {
  get(key: EnvKeys): string {
    const envValue = process.env[key];

    if (isNil(envValue)) {
      throw new Error(
        `Environment variable ${key} is not set or .env file is missing`,
      );
    }

    return envValue;
  }
}
