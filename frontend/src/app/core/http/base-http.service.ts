import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';

export class BaseHttpService {
  protected readonly httpClient = inject(HttpClient);

  protected baseUrl = environment.baseUrl;
}
