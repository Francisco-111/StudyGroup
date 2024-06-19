import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.css']
})
export class DirectChatComponent implements OnInit {
  messageText: string = '';
  messages: any[] = [];
  errorMessage: string = '';
  receiverId: string = '';
  senderId: string | null = '';
  receiverEmail: string = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.receiverId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.afAuth.authState.subscribe(user => {
      this.senderId = user?.uid || '';
    });
  }

  ngOnInit() {
    this.loadMessages();
    this.loadReceiverEmail();
  }

  loadMessages() {
    if (this.senderId) {
      this.chatService.getDirectMessages(this.senderId, this.receiverId).subscribe((data: any) => {
        this.messages = data;
      });
    }
  }

  loadReceiverEmail() {
    this.chatService.getUserEmailById(this.receiverId).subscribe((email: string) => {
      this.receiverEmail = email;
    });
  }

  onSendMessage() {
    if (this.messageText.trim() && this.senderId) {
      const message = {
        text: this.messageText,
        sender: this.senderId,
        timestamp: new Date()
      };
      this.chatService.sendDirectMessage(this.senderId, this.receiverId, message).then(
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
