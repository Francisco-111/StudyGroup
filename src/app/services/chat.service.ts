import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

  sendMessage(groupId: string, message: any) {
    return this.firestore.collection(`groups/${groupId}/messages`).add(message);
  }

  getMessages(groupId: string) {
    return this.firestore.collection(`groups/${groupId}/messages`, ref => ref.orderBy('timestamp')).snapshotChanges();
  }
}
