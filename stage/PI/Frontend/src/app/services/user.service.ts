import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8084'; 

  constructor(private http: HttpClient) { }

  getCurrentUserRole(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/get-current-user-role`);
  }
}
