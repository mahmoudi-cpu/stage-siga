import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import {
  ChatbotserviceService,
  ChatBotResponseDto,
} from '../services/chatbotservice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sporthome',
  templateUrl: './sporthome.component.html',
  styleUrls: ['./sporthome.component.css'],
})
export class SporthomeComponent {
  message: string = ''; // Input field for user message
  chatHistory: ChatBotResponseDto[] = []; // Array to store chat history

  constructor(private chatbotService: ChatbotserviceService) {}

  sendMessage(): void {
    if (this.message.trim()) {
      // Check if message is not empty
      this.chatbotService
        .sendMessage(this.message)
        .subscribe(
          (response: ChatBotResponseDto) => {
            this.chatHistory.push(response);
            this.message = ''; // Clear input field after sending
            console.log(response);
          },
          (error) => {
            console.error('Error sending message:', error);
          }
        );
    }
  }
}
