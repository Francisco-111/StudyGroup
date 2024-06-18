import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messageText: string = '';
  messages: any[] = [];
  errorMessage: string = '';
  groupId: string = '';
  userEmail: string | null = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.afAuth.authState.subscribe(user => {
      this.userEmail = user?.email || '';
    });
  }

  ngOnInit() {
    this.chatService.getMessages(this.groupId).subscribe((data: any) => {
      this.messages = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

  onSendMessage() {
    if (this.messageText.trim()) {
      const message = {
        text: this.messageText,
        sender: this.userEmail,
        timestamp: new Date()
      };
      this.chatService.sendMessage(this.groupId, message).then(
        () => {
          this.messageText = '';
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }
}
