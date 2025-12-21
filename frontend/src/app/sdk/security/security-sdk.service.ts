import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../http/api-client.service';
import { SecurityToken, ValidateTokenResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SecuritySdkService {
  private readonly baseUrl = environment.api.securityBaseUrl;

  constructor(private readonly api: ApiClientService) {}

  generateToken$(): Observable<SecurityToken> {
    return this.api.post$<SecurityToken>(`${this.baseUrl}/generate`, {});
  }

  validateToken$(token: string): Observable<ValidateTokenResponse> {
    return this.api.post$<ValidateTokenResponse>(`${this.baseUrl}/validate`, {
      token_code: token,
    });
  }
}
