import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenStorageServiceService } from './token-storage-service.service';

const BASE_URL = 'http://localhost:8084/';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageServiceService
  ) {}

  register(signRequest: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}api/v1/auth/register`, signRequest);
  }
  login(loginRequest: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}api/v1/auth/authenticate`, loginRequest)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('jwt', response.token);
            console.log('Token stored:', response.token); // Debug log
          }
        })
      );
  }

  logout(): Observable<any> {
    this.tokenStorageService.removeToken();
    return this.http.post<any>(`${BASE_URL}api/v1/auth/logout`, null);
  }
}
