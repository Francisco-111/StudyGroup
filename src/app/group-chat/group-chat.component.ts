import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {
  messageText: string = '';
  messages: any[] = [];
  groupId: string = '';
  userEmail: string | null = '';
  errorMessage: string = '';

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
    if (this.groupId) {
      this.loadMessages();
    }
  }

  loadMessages() {
    this.chatService.getMessages(this.groupId).subscribe((data: any) => {
      this.messages = data;
    });
  }

  onSendMessage() {
    if (this.messageText.trim() && this.userEmail) {
      const message = {
        text: this.messageText,
        sender: this.userEmail,
        timestamp: new Date()
      };
      this.chatService.sendMessage(this.groupId, message).then(
        () => {
          this.messageText = '';
          this.loadMessages();
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }
}
