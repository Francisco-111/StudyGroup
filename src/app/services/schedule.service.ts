// schedule.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {catchError, map} from "rxjs/operators";
import { first } from 'rxjs/operators';
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  getSchedules(groupId: string): Observable<any[]> {
    return this.firestore.collection(`groups/${groupId}/schedules`).snapshotChanges().pipe(
      map(actions => {
        const schedules = actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        console.log(`Fetched schedules for group ${groupId}:`, schedules); // Logging fetched schedules
        return schedules;
      }),
      catchError(err => {
        console.error(err);
        return from([]);
      })
    );
  }

  async createSchedule(groupId: string, schedule: any) {
    const docRef = await this.firestore.collection('groups/' + groupId + '/schedules').add(schedule);
    const doc = await docRef.get();
    // @ts-ignore
    return { id: docRef.id, ...doc.data() }; // Return the document data along with its ID
  }

  deleteSchedule(groupId: string, scheduleId: string) {
    return this.firestore.doc('groups/' + groupId + '/schedules/' + scheduleId).delete();
  }

  getCurrentUser() {
    return this.afAuth.authState.pipe(first()).toPromise().then(user => {
      console.log('Current User:', user);
      return user;
    });
  }
}
