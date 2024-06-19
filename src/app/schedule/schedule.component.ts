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
  eventTime: string = '';
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
    if (this.eventName && this.eventDate && this.eventTime) {
      const schedule = {
        eventName: this.eventName,
        eventDate: this.eventDate,
        eventTime: this.eventTime
      };
      this.scheduleService.createSchedule(this.groupId, schedule).then(
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
}
