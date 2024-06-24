import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private firestore: AngularFirestore,
  ) {}

  sendMessage(groupId: string, message: any) {
    return this.firestore.collection('groups/' + groupId + '/messages').add(message);
  }

  getMessages(groupId: string): Observable<any[]> {
    return this.firestore.collection('groups/' + groupId + '/messages', ref => ref.orderBy('timestamp')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      }))
    );
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

  deleteMessage(groupId: string, messageId: string) {
    return this.firestore.collection(`groups/${groupId}/messages`).doc(messageId).delete();
  }
}
