import { AddressType, Client } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { EnvKeys, EnvService } from '@shared/services/env.service';
import {
  DEFAULT_GEOCODE_RESULT,
  GoogleServiceGeocodeResult,
} from '@shared/types/google-service.types';

@Injectable()
export class GoogleMapsService {
  private readonly _client = new Client();
  private readonly _apiKey = this.envService.get(
    EnvKeys.GOOGLE_MAPS_PLATFORM_API_KEY,
  );

  constructor(private readonly envService: EnvService) {}

  async geocode(address: string): Promise<GoogleServiceGeocodeResult> {
    const geocodeResponse = await this._client.geocode({
      params: {
        key: this._apiKey,
        address,
      },
    });

    const {
      data: { results },
    } = geocodeResponse;

    const result = DEFAULT_GEOCODE_RESULT;

    if (results.length !== 0) {
      const voivodeship = results[0].address_components.reduce<string | null>(
        (acc, addressComponent) => {
          const hasVoivodeshipType = addressComponent.types.includes(
            AddressType.administrative_area_level_1,
          );

          if (hasVoivodeshipType) {
            return addressComponent.long_name;
          }

          return acc;
        },
        null,
      );

      const location = results[0].geometry.location;

      result.voivodeship = voivodeship;
      result.position = location;
    }

    return result;
  }
}
