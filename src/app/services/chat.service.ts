import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService
  ) {}

  sendMessage(groupId: string, message: any) {
    return this.firestore.collection('groups/'+ groupId +'/messages').add(message);
  }

  getMessages(groupId: string): Observable<any[]> {
    return this.firestore.collection('groups/' + groupId + '/messages', ref => ref.orderBy('timestamp')).valueChanges();
  }

  uploadFile(groupId: string, file: File, userEmail: string): Observable<any> {
    const filePath = 'groups/' + groupId + '/files/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().pipe(
        switchMap((url: string) => this.addFileRecord(groupId, { name: file.name, url, uploadedBy: userEmail, timestamp: new Date() }))
      ))
    );
  }

  getFiles(groupId: string): Observable<any[]> {
    return this.firestore.collection('groups/' + groupId + '/files').valueChanges();
  }

  addFileRecord(groupId: string, fileRecord: any) {
    return this.firestore.collection('groups/' + groupId + '/files').add(fileRecord);
  }

  sendDirectMessage(senderId: string, receiverId: string, message: any) {
    const chatId = this.getChatId(senderId, receiverId);
    return this.firestore.collection('directChats/' + chatId + '/messages').add(message);
  }

  getDirectMessages(senderId: string, receiverId: string): Observable<any[]> {
    const chatId = this.getChatId(senderId, receiverId);
    return this.firestore.collection('directChats/' + chatId + '/messages', ref => ref.orderBy('timestamp')).valueChanges();
  }

  getUserEmailById(userId: string): Observable<string> {
    return this.userService.getUserEmailById(userId);
  }

  private getChatId(senderId: string, receiverId: string): string {
    return senderId < receiverId ? senderId + '_' + receiverId : receiverId + '_' + senderId;
  }
}
