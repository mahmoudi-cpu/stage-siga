import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { OfferLoan } from '../Models/Loan/offer-loan';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OfferLoanService {
  
  private baseUrl ='http://localhost:8084/offer_loan';
  private token = 
'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3aXNzb2JlamFvdWlAZ21haWwuY29tIiwiaWF0IjoxNzE0NjE5MjQ0LCJleHAiOjE3MTQ3MDU2NDR9.UqJC7tOGy-ZOBav8n1h7r_EizT55sg3FL3UIbRAhCaY';
  constructor(private http:HttpClient) { }

  retrieveAllOfferLoans(): Observable<OfferLoan[]> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    return this.http.get<OfferLoan[]>(this.baseUrl+'/retrieve_all_offers', { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching offers:', error);
          return throwError('Something went wrong, please try again later.');
        })
      );
  }
  fetchLastTmmValue(): Observable<number> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });      
    return this.http.get<number>(`${this.baseUrl}/tmmValue`, { headers })
    .pipe(
      catchError((error: any) => {
        console.error('Error fetching offers:', error);
        return throwError('Something went wrong, please try again later.');
      })
    );
  }

retrieveOfferLoan(id:number){ 
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  return this.http.get<OfferLoan>(this.baseUrl+ '/retrieve_offer' +id, { headers }) 
  .pipe(
    catchError((error: any) => {
      console.error('Error fetching offers N°:'+id, error);
      return throwError('Something went wrong, please try again later.');
    })
  );
}

addOfferLoan(offer:OfferLoan) : Observable <OfferLoan>{ 
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  return this.http.post<OfferLoan>(this.baseUrl + '/add-offer', offer, { headers }) 
  .pipe(
    catchError((error: any) => {
      console.error('Error adding offer', error);
      return throwError('Something went wrong, please try again later.');
    })
  );
}

modifyOfferLoan(offer: OfferLoan): Observable<OfferLoan> {
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  const url = `${this.baseUrl}/modify-offer/${offer.idOffer}`;

  return this.http.put<OfferLoan>(url, offer, { headers }).pipe(
    catchError((error: any) => {
      console.error('Error modifying offer', error);
      return throwError('Something went wrong, please try again later.');
    })
  );
}

removeOfferLoan(id:number){ 
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });  
   return this.http.delete<OfferLoan>(this.baseUrl+ '/' +id, { headers }) 
   .pipe(
    catchError((error: any) => {
      console.error('Error adding offer', error);
      return throwError('Something went wrong, please try again later.');
    })
  );
}



simulationCalMonthlyRepaymentAmount(idOffer: number, loanAmnt: number, nbrMonth: number): Observable<number> {
  const url = `${this.baseUrl}/simulation_calculate-monthly-repayment-amount`;
  const params = { idOffer, loanAmnt, nbrMonth };
  return this.http.get<number>(url, { params });
}

simulationCalYearlyRepaymentAmount(idOffer: number, loanAmnt: number, nbrYears: number, typeAmort: string): Observable<number> {
  const url = `${this.baseUrl}/simulation_calculate-yearly-repayment-amount/${typeAmort}`;
  const params = { idOffer, loanAmnt, nbrYears };
  return this.http.get<number>(url, { params });


}

countRequestLoansByOfferId(idOffer: number): Observable<number> {
  const url = `${this.baseUrl}/count_requestLoans/${idOffer}`;
  return this.http.get<number>(url);
}

countAvailableOffers(): Observable<number> {
  const url = `${this.baseUrl}/available_offer`;
  return this.http.get<number>(url);
}

searchOffersByMinAmount(searchedAmount: number): Observable<any> {
  const url = `${this.baseUrl}/search_offer?searchedAmount=${searchedAmount}`;
  return this.http.get<any>(url);
}


}



/*

fetchTmmValue(): Observable<number> {
  return this.http.get('https://www.stb.com.tn/fr/site/bourse-change/historique-des-tmm/')
    .pipe(
      map(htmlContent => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlContent.toString(), 'text/html');
        const table = htmlDoc.querySelector('table.cours-de-change');
        const lastRow = table?.querySelector('tr:last-child');
        const tmmCell = lastRow?.querySelector('td.achat-change');
        return tmmCell?.textContent?.trim() ? parseFloat(tmmCell.textContent.trim()) : null;
      }),
      filter(tmmValue => tmmValue !== null), // filter out null values
      map(tmmValue => tmmValue as number)
    );
}


searchOffersByMinAmount(searchedAmount: number): Observable<OfferLoan[]> {
   return this.http.get<OfferLoan[]>(${this.baseUrl}/search\_offer?searchedAmount=${searchedAmount}); 
  }

countAvailableOffers(): Observable<number> { 
  return this.http.get<number>(${this.baseUrl}/AVAILABLE\_offer); }

countRequestLoansByOfferId(offerId: number): Observable<number> { 
  return this.http.get<number>(${this.baseUrl}/count\_requestLoans/${offerId}); 
}

simulationCalMonthlyRepaymentAmount(offerId: number, loanAmnt: number, nbrMonth: number): Observable<number> { 
  return this.http.get<number>(${this.baseUrl}/simulation\_calculate-monthly-repayment-amount?offerId=${offerId}&loanAmnt=${loanAmnt}&nbrMonth=${nbrMonth}); 
}

simulationCalYearlyRepaymentAmount(offerId: number, loanAmnt: number, nbrYears: number, typeAmort: string): Observable<number> { 
  return this.http.get<number>(${this.baseUrl}/simulation\_calculate-yearly-repayment-amount/${typeAmort}?offerId=${offerId}&loanAmnt=${loanAmnt}&nbrYears=${nbrYears}); 
}



*/


  
