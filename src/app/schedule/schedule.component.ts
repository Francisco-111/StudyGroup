import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  eventName: string = '';
  eventDate: string = '';
  eventTime: string = ''; // Optional, can be empty
  startTime: string = ''; // Optional, can be empty
  endTime: string = ''; // Optional, can be empty
  eventDescription: string = ''; // Optional, can be empty
  errorMessage: string = '';
  schedules: any[] = [];
  groupId: string = '';

  constructor(private scheduleService: ScheduleService, private route: ActivatedRoute) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.scheduleService.getSchedules(this.groupId).subscribe((data: any) => {
      this.schedules = data;
    });
  }

  onCreateSchedule() {
    if (this.eventName && this.eventDate) {
      const schedule = {
        eventName: this.eventName,
        eventDate: this.eventDate,
        eventTime: this.eventTime || null,
        startTime: this.startTime || null,
        endTime: this.endTime || null,
        eventDescription: this.eventDescription || null
      };
      this.scheduleService.createSchedule(this.groupId, schedule).then(
        () => {
          this.eventName = '';
          this.eventDate = '';
          this.eventTime = '';
          this.startTime = '';
          this.endTime = '';
          this.eventDescription = '';
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }
}
