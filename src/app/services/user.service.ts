import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      }))
    );
  }

  getUserEmailById(userId: string): Observable<string> {
    return this.firestore.collection('users').doc(userId).get().pipe(
      map(doc => {
        const data = doc.data();
        // @ts-ignore
        return data ? data.email : '';
      })
    );
  }
}
