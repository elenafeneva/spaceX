import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const API_BASE = 'https://localhost:44382/api';

@Injectable({ providedIn: 'root' })
export class SpacexService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getSpaceXData(typeOfLaunches: string): Observable<unknown> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
    return this.http
      .get(`${API_BASE}/SpaceX/${typeOfLaunches}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let message = 'Request failed';
    if (error?.status === 0) {
      message = 'Cannot reach the API. Check that it is running and that the HTTPS certificate is trusted.';
    } else if (error?.status && error?.status !== 200) {
      message = error?.error ?? 'Error calling SpaceX API';
    } else if (error?.status === 500) {
      message = 'Internal server error.';
    }
    return throwError(() => ({ status: error?.status, error: error?.error, message }));
  }
}
