import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {
  messageText: string = '';
  messages: any[] = [];
  files: any[] = [];
  errorMessage: string = '';
  groupId: string = '';
  userEmail: string | null = '';
  isMember: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private chatService: ChatService,
    private groupService: GroupService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.afAuth.authState.subscribe(user => {
      this.userEmail = user?.email || '';
      if (this.userEmail) {
        this.checkMembership();
      }
    });
  }

  ngOnInit() {
    this.loadMessages();
    this.loadFiles();
  }

  checkMembership() {
    // @ts-ignore
    this.groupService.isMember(this.groupId, this.userEmail).subscribe(isMember => {
      this.isMember = isMember;
      if (!isMember) {
        this.errorMessage = "You are not a member of this group.";
      } else {
        this.loadMessages();
        this.loadFiles();
      }
    });
  }

  loadMessages() {
    this.chatService.getMessages(this.groupId).subscribe((data: any) => {
      this.messages = data;
    });
  }

  loadFiles() {
    this.chatService.getFiles(this.groupId).subscribe((data: any) => {
      this.files = data;
    });
  }

  onSendMessage() {
    if (this.messageText.trim() && this.isMember) {
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUploadFile() {
    if (this.selectedFile && this.isMember) {
      const file = this.selectedFile;
      const filePath = 'groups/' + this.groupId + '/files/' + file.name;
      // @ts-ignore
      const fileRef = this.chatService.uploadFile(this.groupId, file);

      fileRef.subscribe({
        next: () => {},
        complete: () => {
          fileRef.subscribe((url: string) => {
            const fileRecord = {
              name: file.name,
              url: url,
              uploadedBy: this.userEmail,
              timestamp: new Date()
            };
            this.chatService.addFileRecord(this.groupId, fileRecord).then(() => {
              this.selectedFile = null;
              this.loadFiles(); // Refresh the file list
            });
          });
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }
}
