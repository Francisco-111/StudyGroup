import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { ChatService } from '../services/chat.service';
import { GroupService } from '../services/group.service';
import { FileService } from '../services/file.service';
import {switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$: Observable<firebase.User | null>;
  // @ts-ignore
  directChats$: Observable<any[]>; // Adjust the type based on your chat data
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
    this.user$.subscribe(user => {
      if (user) {
        this.directChats$ = this.chatService.getUserChats(user.uid);
        // @ts-ignore
        this.groups$ = this.groupService.getUserGroups(user.email).pipe(
          switchMap(groups => {
            return groups.map(group => {
              return {
                ...group,
                chats: this.chatService.getMessages(group.id),
                files: this.chatService.getFiles(group.id)
              };
            });
          })
        );
        this.files$ = this.fileService.getUserFiles(user.uid);
      }
    });
  }
}
