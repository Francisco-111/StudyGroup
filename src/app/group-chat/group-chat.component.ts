import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { format } from 'date-fns';

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
  selectedMessages: Set<string> = new Set();
  selectingMessages: boolean = false;
  userMessagesExist: boolean = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.afAuth.authState.subscribe(user => {
      this.userEmail = user?.email || '';
      if (this.userEmail) {
        this.checkUserMessagesExist();
      }
    });
  }

  ngOnInit() {
    if (this.groupId) {
      this.loadMessages();
    }
  }

  checkUserMessagesExist() {
    this.chatService.getMessages(this.groupId).subscribe((data: any) => {
      this.userMessagesExist = data.some((msg: any) => msg.sender === this.userEmail);
    });
  }

  loadMessages() {
    this.chatService.getMessages(this.groupId).subscribe((data: any) => {
      this.messages = data.map((msg: any) => ({
        ...msg,
        formattedTimestamp: this.formatTimestamp(msg.timestamp)
      }));
    }, error => {
      this.errorMessage = 'Error loading messages: ' + error.message;
    });
  }

  onSendMessage() {
    if (this.messageText.trim() && this.userEmail) {
      const message = {
        text: this.messageText,
        sender: this.userEmail,
        timestamp: new Date().toISOString()
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

  toggleMessageSelection(messageId: string) {
    if (this.selectedMessages.has(messageId)) {
      this.selectedMessages.delete(messageId);
    } else {
      this.selectedMessages.add(messageId);
    }
  }

  deleteSelectedMessages() {
    this.selectedMessages.forEach(messageId => {
      this.chatService.deleteMessage(this.groupId, messageId).then(
        () => {
          this.loadMessages();
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    });
    this.selectedMessages.clear();
    this.selectingMessages = false;
  }

  toggleSelectingMessages() {
    this.selectingMessages = !this.selectingMessages;
    if (!this.selectingMessages) {
      this.selectedMessages.clear();
    }
  }

  cancelSelection() {
    this.selectingMessages = false;
    this.selectedMessages.clear();
  }

  goBack() {
    this.router.navigate(['/groups']); // Navigate back to groups
  }

  formatTimestamp(timestamp: any): string {
    try {
      if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
        // Firestore timestamp
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return format(date, 'MM/dd/yyyy hh:mm:ss a');
      } else {
        // ISO string
        const date = new Date(timestamp);
        return format(date, 'MM/dd/yyyy hh:mm:ss a');
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  }
}
