import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    constructor(private firestore: AngularFirestore) { }

    createGroup(groupName: string, members: string[]) {
        return this.firestore.collection('groups').add({ groupName, members });
    }

    getGroups() {
        return this.firestore.collection('groups').snapshotChanges();
    }

    createSchedule(groupId: string, schedule: any) {
        return this.firestore.collection(`groups/${groupId}/schedules`).add(schedule);
    }

    getSchedules(groupId: string) {
        return this.firestore.collection(`groups/${groupId}/schedules`).snapshotChanges();
    }
}
