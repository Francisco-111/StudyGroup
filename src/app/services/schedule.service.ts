import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private firestore: AngularFirestore) {}

  getSchedules(groupId: string) {
    return this.firestore.collection('groups/' + groupId + '/schedules', ref => ref.orderBy('eventDate')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createSchedule(groupId: string, schedule: any) {
    return this.firestore.collection('groups/' + groupId + '/schedules').add(schedule);
  }
}
