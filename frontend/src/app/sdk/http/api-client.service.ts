import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  constructor(private readonly http: HttpClient) {}

  post$<T>(url: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(url, body)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      typeof error.error === 'string'
        ? error.error
        : error.error?.message ?? error.message ?? 'Unexpected error';
    return throwError(() => new Error(message));
  }
}
