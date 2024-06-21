import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { UserService } from './user.service';
import {map} from "rxjs/operators";

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
    return this.firestore.collection('groups/' + groupId + '/messages').add(message);
  }

  getMessages(groupId: string): Observable<any[]> {
    return this.firestore.collection('groups/' + groupId + '/messages', ref => ref.orderBy('timestamp')).valueChanges();
  }

  uploadFile(groupId: string, file: File) {
    const filePath = 'groups/' + groupId + '/files/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return fileRef;
  }

  updateFileRecord(groupId: string, fileId: string, fileRecord: any) {
    return this.firestore.doc(`groups/${groupId}/files/${fileId}`).update(fileRecord);
  }

  deleteFileRecord(groupId: string, fileId: string) {
    return this.firestore.collection(`groups/${groupId}/files`).doc(fileId).delete();
  }

  getFiles(groupId: string): Observable<any[]> {
    return this.firestore.collection(`groups/${groupId}/files`, ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
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

  getUserChats(userId: string): Observable<any[]> {
    return this.firestore.collection('directChats', ref => ref.where('members', 'array-contains', userId)).valueChanges();
  }


  private getChatId(senderId: string, receiverId: string): string {
    return senderId < receiverId ? senderId + '_' + receiverId : receiverId + '_' + senderId;
  }
}
