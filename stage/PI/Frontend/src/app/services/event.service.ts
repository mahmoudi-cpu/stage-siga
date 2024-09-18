
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Event } from'../Models/Event/event';
import { Injectable } from '@angular/core';
//import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8084/Event/all';
  private baseUrl10 = 'http://localhost:8084/Event/events'
  private baseUrl4 = 'http://localhost:8084/Event/delete';
  private baseUrl2 = 'http://localhost:8084/Event/create-and-assign';
  private baseUrl3 = 'http://localhost:8084/Event/update';
  private baseUrl5 = 'http://localhost:8084/Event/get';
  private baseUrl7 = 'http://localhost:8084/Event/assignshrtoevent';
  private baseUrl8 = 'http://localhost:8084/Event/events';

  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWhtb3VkaS5iaWxlbDIwQGdtYWlsLmNvbSIsImlhdCI6MTcyNjY4Mjc1MSwiZXhwIjoxNzI2NzY5MTUxfQ.nl-jG1NwKPM46VyePj8aVyLzR0wChOmJMiJ6uqG86Mk';



  constructor(private http: HttpClient) { }
    // Méthode pour mettre à jour l'état de participation
   /* updateParticipation(eventId: number, participating: boolean): Observable<any> {
      return this.http.put<any>(`/api/events/${eventId}/participation`, { participating });
    }
*/
  
getEventInfo(): Observable<string> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
});
  return this.http.get<string>(this.baseUrl,{ headers: headers });
}
  getEvents(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<any[]>(this.baseUrl,{ headers: headers });
  }
  calculIndiceRentabilite(id: number): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<number>(`${this.baseUrl10}/${id}/indice-rentabilite`,{ headers: headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching Events:', error);
        return throwError('Something went wrong, please try again later.');
      }));
   
  }
  getEventsList(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get<any[]>(this.baseUrl,{ headers: headers });
  }

  addEvent(Event: Object): Observable<Object> {
    console.log('Données de l\'événement avant l\'ajout :', Event);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });

    return this.http.post(`${this.baseUrl2}`, Event, { headers: headers }).pipe(
      tap(response => console.log('Réponse du backend après l\'ajout de l\'événement :', response))
    );
  }
  
  getEvent(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.get(`${this.baseUrl5}/${id}`, { headers:headers });

  }

  updateEvent(idEvent: number, value: any): Observable<Event> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Ensure this.token holds the valid JWT token
  });
    return this.http.put<Event>(`${this.baseUrl3}`, value, { headers:headers });
  }

  deleteEvent(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
  });
    return this.http.delete(`${this.baseUrl4}/${id}`, { responseType: 'text' , headers: headers});
  }

  searchEventByNameEvent(nameEvent: string): Observable<Event[]> {
    return this.getEventsList().pipe(
      map((events: Event[]) => events.filter(event => event.nameEvent.toLowerCase().includes(nameEvent.toLowerCase())))
    );
  }
  investInEvent(nameEvent: string, shareHolder: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl7}/${nameEvent}`, shareHolder);
  }
  likeEvent(eventName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
  });
  return this.http.post<any>(`${this.baseUrl8}/${eventName}/like`,{},{ headers: headers});
  }
  
  dislikeEvent(eventName: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
  });
  return this.http.post<any>(`${this.baseUrl8}/${eventName}/dislike`,{},{ headers: headers});
  }
 
 
}

