import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Amortization } from '../Models/Loan/amortization';

@Injectable({
  providedIn: 'root'
})
export class AmortizationService {

  private baseUrl = 'http://localhost:8084/amortization';
  private token = 
'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3aXNzb2JlamFvdWlAZ21haWwuY29tIiwiaWF0IjoxNzE0NjE5MjQ0LCJleHAiOjE3MTQ3MDU2NDR9.UqJC7tOGy-ZOBav8n1h7r_EizT55sg3FL3UIbRAhCaY';

  constructor(private http: HttpClient) { }

  retrieveAllAmortization(): Observable<Amortization[]> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    return this.http.get<Amortization[]>(this.baseUrl+'/retrieve_all_amortization', { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching offers:', error);
          return throwError('Something went wrong, please try again later.');
        })
      );
  }



  
  retrieveAmortization(idAmt: number): Observable<Amortization> {
    return this.http.get<Amortization>(`${this.baseUrl}/retrieve_amortization/${idAmt}`);
  }

  addAmortizationFees(requestId: number, fees: number): Observable<Amortization> {
    return this.http.post<Amortization>(`${this.baseUrl}/add-amortization-fees/${requestId}?fees=${fees}`, null);
  }

  modifyAmortization(amortization: Amortization): Observable<Amortization> {
    return this.http.put<Amortization>(`${this.baseUrl}/modify-amortization`, amortization);
  }

  removeAmortization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-amortization/${id}`);
  }





}