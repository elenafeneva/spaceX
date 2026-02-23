import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthResponse, SignInRequest, SignUpRequest } from '../models';

const TOKEN_KEY = 'auth_token';
const API_BASE = 'https://localhost:44382/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  signIn(credentials: SignInRequest): Observable<string> {
    const body = { email: credentials.email, password: credentials.password };
    return this.http
      .post(`${API_BASE}/Authorization/login`, body, { responseType: 'text' as const })
      .pipe(catchError(this.handleError));
  }

  signUp(signUpUser: SignUpRequest): Observable<AuthResponse> {
    const body = {
      firstName: signUpUser.firstName,
      lastName: signUpUser.lastName,
      email: signUpUser.email,
      password: signUpUser.password,
    };
    return this.http
      .post<AuthResponse>(`${API_BASE}/Authorization/register`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let message = 'Request failed';
    if (error?.status === 0) {
      message = 'Cannot reach the API. Check that it is running and that the HTTPS certificate is trusted.';
    } else if (error?.status === 400) {
      message = error?.error ?? 'Invalid request. Please check your inputs.';
    }
    return throwError(() => ({ status: error?.status, error: error?.error, message }));
  }
}
