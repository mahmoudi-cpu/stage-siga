import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const BASE_URL = ['http://localhost:8084/'];

export interface ChatBotResponseDto {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotserviceService {
  private baseUrl = BASE_URL + 'chatbot/send';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatBotResponseDto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { message }; // Create request body with message
    return this.http.post<ChatBotResponseDto>(this.baseUrl, body, { headers });
  }
}
