import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private firestore: AngularFirestore) {}

  getSchedules(groupId: string) {
    return this.firestore.collection('groups/' + groupId + '/schedules').valueChanges();
  }

  createSchedule(groupId: string, schedule: any) {
    return this.firestore.collection('groups/' + groupId + '/schedules').add(schedule);
  }
}
