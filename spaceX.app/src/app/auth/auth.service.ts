import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const API_BASE = '/api';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: unknown;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signIn(credentials: SignInRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE}/auth/signin`, credentials)
      .pipe(catchError(this.handleError));
  }

  signUp(payload: SignUpRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE}/auth/signup`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: { status?: number; error?: unknown; message?: string }) {
    const message =
      error?.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message: string }).message
        : error?.message ?? 'Request failed';
    return throwError(() => ({ status: error?.status, error: error?.error, message }));
  }
}
