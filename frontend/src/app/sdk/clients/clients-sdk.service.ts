import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../http/api-client.service';
import { RegisterClientRequest, RegisterClientResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientsSdkService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly api: ApiClientService) {}

  registerClient$(
    payload: RegisterClientRequest
  ): Observable<RegisterClientResponse> {
    return this.api.post$<RegisterClientResponse>(
      `${this.baseUrl}/clients/clients`,
      payload
    );
  }
}
