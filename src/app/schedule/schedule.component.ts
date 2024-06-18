import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  eventName: string = '';
  eventDate: string = '';
  eventTime: string = '';
  errorMessage: string = '';
  schedules: any[] = [];
  groupId: string = '';

  constructor(private groupService: GroupService, private route: ActivatedRoute) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.groupService.getSchedules(this.groupId).subscribe((data: any) => {
      this.schedules = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

  onCreateSchedule() {
    const schedule = {
      eventName: this.eventName,
      eventDate: this.eventDate,
      eventTime: this.eventTime
    };
    this.groupService.createSchedule(this.groupId, schedule).then(
      () => {
        this.eventName = '';
        this.eventDate = '';
        this.eventTime = '';
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
}
