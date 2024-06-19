import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private firestore: AngularFirestore) {}

  createSchedule(groupId: string, schedule: any) {
    return this.firestore.collection('groups/${groupId}/schedules').add(schedule);
  }

  getSchedules(groupId: string): Observable<any[]> {
    return this.firestore.collection('groups/' + groupId + '/schedules').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      }))
    );
  }
}
