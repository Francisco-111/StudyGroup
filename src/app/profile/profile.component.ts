// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { ChatService } from '../services/chat.service'; // Assume you have a service for managing chats
import { GroupService } from '../services/group.service'; // Assume you have a service for managing groups
import { FileService } from '../services/file.service'; // Assume you have a service for managing files

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$: Observable<firebase.User | null>;
  // @ts-ignore
  chats$: Observable<any[]>; // Adjust the type based on your chat data
  // @ts-ignore
  groups$: Observable<any[]>; // Adjust the type based on your group data
  // @ts-ignore
  files$: Observable<any[]>; // Adjust the type based on your file data

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private groupService: GroupService,
    private fileService: FileService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // @ts-ignore
    this.chats$ = this.chatService.getUserChats(); // Adjust method to fetch user chats
    // @ts-ignore
    this.groups$ = this.groupService.getUserGroups(); // Adjust method to fetch user groups
    // @ts-ignore
    this.files$ = this.fileService.getUserFiles(); // Adjust method to fetch user files
  }
}
