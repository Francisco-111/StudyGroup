import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from 'firebase/compat/app';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private firestore: AngularFirestore) {}

  createGroup(groupName: string, userEmail: string) {
    return this.firestore.collection("groups").add({
      groupName,
      members: [userEmail],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  getGroups(): Observable<any[]> {
    return this.firestore.collection("groups").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      }))
    );
  }

  getUserGroups(userEmail: string): Observable<any[]> {
    return this.firestore.collection("groups", ref => ref.where('members', 'array-contains', userEmail)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      }))
    );
  }

  joinGroup(groupId: string, userEmail: string) {
    return this.firestore.collection("groups").doc(groupId).update({
      members: firebase.firestore.FieldValue.arrayUnion(userEmail)
    });
  }

  leaveGroup(groupId: string, userEmail: string) {
    return this.firestore.collection("groups").doc(groupId).update({
      members: firebase.firestore.FieldValue.arrayRemove(userEmail)
    });
  }
}
