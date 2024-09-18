import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { RequestLoan } from '../Models/Loan/request-loan';

@Injectable({
  providedIn: 'root'
})
export class RequestLoanService {
  
  private baseUrl='http://localhost:8084/request_loan';
  private token = 
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3aXNzb2JlamFvdWlAZ21haWwuY29tIiwiaWF0IjoxNzE0NjE5MjQ0LCJleHAiOjE3MTQ3MDU2NDR9.UqJC7tOGy-ZOBav8n1h7r_EizT55sg3FL3UIbRAhCaY';
  
  constructor(private http:HttpClient) { }

  retrieveAllLoans(): Observable <RequestLoan[]>{
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    return this.http.get<RequestLoan[]>(this.baseUrl+'/retrieve_All_request', { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching offers:', error);
          return throwError('Something went wrong, please try again later.');
        })
      );
  }




  retrieveLoan(requestId: number): Observable<RequestLoan> {
    return this.http.get<RequestLoan>(`${this.baseUrl}/retrieve_request/${requestId}`);
  }

  addLoanAndAssignToOffer(idOffer: number, type: string, file: File, requestLoan: RequestLoan): Observable<RequestLoan> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('requestLoan', JSON.stringify(requestLoan));
    return this.http.post<RequestLoan>(`${this.baseUrl}/add-loan-and-assign-to-offer/${idOffer}/${type}`, formData);
  }

  modifyLoan(request: RequestLoan): Observable<RequestLoan> {
    return this.http.put<RequestLoan>(`${this.baseUrl}/modify-loan`, request);
  }

  removeLoan(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-loan/${requestId}`);
  }

  findLoansByStatus(status: string): Observable<RequestLoan[]> {
    return this.http.get<RequestLoan[]>(`${this.baseUrl}/find_by_status?status=${status}`);
  }

  rejectLoan(requestId: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/reject_req/${requestId}`, null);
  }

  approveLoan(requestId: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/approve/${requestId}`, null);
  }

  unassignAmortizationFromRequest(requestId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/unaffecter-request-from-amortization/${requestId}`, null);
  }

  retrieveAllLoansWithAmortization(): Observable<RequestLoan[]> {
    return this.http.get<RequestLoan[]>(`${this.baseUrl}/loans-with-amortization`);
  }



}
