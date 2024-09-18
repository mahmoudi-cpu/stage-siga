import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators'; // Import the map operator
import { Shareholder,TypeShareholder } from '../Models/Shareholder/shareholder';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Event } from '../Models/Event/event';

@Injectable({
  providedIn: 'root'
})
export class ShareholderService {
  private baseUrl = 'http://localhost:8084/ShareHolder/all';
  private baseUrl7 = 'http://localhost:8084/Event';
  private baseUrl4 = 'http://localhost:8084/ShareHolder';
  private baseUrl2 = 'http://localhost:8084/ShareHolder/add';
  private baseUrl3 = 'http://localhost:8084/ShareHolder/update';
  private baseUrl5 = 'http://localhost:8084/ShareHolder/add-shareholder';
  private baseUrl6 = 'http://localhost:8084/ShareHolder/current';

  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWhtb3VkaS5iaWxlbDIwQGdtYWlsLmNvbSIsImlhdCI6MTcyNjY4Mjc1MSwiZXhwIjoxNzI2NzY5MTUxfQ.nl-jG1NwKPM46VyePj8aVyLzR0wChOmJMiJ6uqG86Mk';
  constructor(private http: HttpClient) { }

  getShareholders(): Observable<Shareholder[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<Shareholder[]>(this.baseUrl,{ headers: headers });
  }
 /* assignShareholderToEvent(idShareholder: number, idEvent: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    const body = { idShareholder, idEvent };
    return this.http.post(`${this.baseUrl5}/${idEvent}`, body, { headers: headers });
  }
*/

  getShareholderList(): Observable<Shareholder[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<Shareholder[]>(this.baseUrl,{ headers: headers });
  }

  addShareholder(Shareholder: Object): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.post(`${this.baseUrl2}`, Shareholder,{ headers: headers });
  }

  public CountLikes(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    let x1= this.http.get(`${this.baseUrl7}/recommend`,{ headers: headers })
    return x1
  }
  public CountWithoutsh(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    let x1= this.http.get(`${this.baseUrl7}/count-withoutsh`,{ headers: headers })
    return x1
  }
  assignShareholderToEvent(shareHolder: Object, eventName: string): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.post<Object>(`${this.baseUrl5}/${eventName}`, Shareholder,{ headers: headers });
  }

  getShareholder(id: number): Observable<Shareholder> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<Shareholder>(`${this.baseUrl4}/get/${id}`,{ headers: headers });
  }
  getInterestRateForShareholder(type: TypeShareholder, investmentAmount: number): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<number>(`${this.baseUrl4}/shareholders/${type}/${investmentAmount}/interest-rate`,{ headers: headers });
  }
  getCurrentShareholder(): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Assurez-vous que this.token contient le token JWT valide
    });

    return this.http.get<number>(`${this.baseUrl6}`, { headers: headers });
  }

  updateShareholder(id: number, value: any): Observable<Shareholder> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.put<Shareholder>(`${this.baseUrl3}`, value,{ headers: headers });
  }

  deleteShareholder(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.delete(`${this.baseUrl4}/delete/${id}`, { responseType: 'text' , headers: headers });
  }
  generatePDFForShareholder(id: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl4}/${id}/generate-pdf`);
  }

  generatePDFForAllShareholder(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl4}/Shareholder/pdf`);
  }
  searchShareholderByName(name: string): Observable<Shareholder[]> {
    return this.getShareholderList().pipe(
      map((shareholders: Shareholder[]) => shareholders.filter(shareholder => shareholder.lastNameShareholder.toLowerCase().includes(name.toLowerCase())))
    );
  }
  retrieveShareholderByType(partner: string): Observable<Shareholder[]> {
    return this.http.get<Shareholder[]>(`${this.baseUrl4}/retrieve-Shareholderbytype/${partner}`);
  }
  public save(shareholder: Shareholder,idShareholder:Number,idEvent:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });

    return this.http.post(`${this.baseUrl5}/${idShareholder}/${idEvent}`, shareholder, { headers: headers });
  }
  public assign(shareholder: Shareholder,idEvent: number){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
  return this.http.post(`${this.baseUrl5}/${idEvent}`,shareholder, { headers: headers });
  }

 

 
}
