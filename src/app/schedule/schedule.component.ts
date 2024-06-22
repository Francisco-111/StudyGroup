import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { ScheduleService } from '../services/schedule.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {EventDetailDialogComponent} from "../event-detail-dialog/event-detail-dialog.component";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: []
  };
  errorMessage: string = '';
  groupId: string = '';

  constructor(private scheduleService: ScheduleService, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar,  private router: Router) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.scheduleService.getSchedules(this.groupId).subscribe((data: any) => {
      this.calendarOptions.events = data.map((event: any) => ({
        id: event.id,
        title: event.eventName,
        start: event.eventDate,
        end: event.endTime ? `${event.eventDate}T${event.endTime}` : undefined,
        description: event.eventDescription,
        extendedProps: {
          startTime: event.startTime,
          eventTime: event.eventTime
        }
      }));
    });
  }

  handleDateClick(arg: any) {
    const selectedDateStr = new Date(arg.dateStr).toISOString().split('T')[0];
    const currentDateStr = new Date().toISOString().split('T')[0];

    if (selectedDateStr < currentDateStr) {
      this.snackBar.open('You cannot create an event in the past.', 'Close', {
        duration: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { eventDate: arg.dateStr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.createSchedule(this.groupId, result).then(
          () => {
            // @ts-ignore
            this.calendarOptions.events = [...this.calendarOptions.events, {
              id: result.id,
              title: result.eventName,
              start: result.eventDate,
              end: result.endTime ? `${result.eventDate}T${result.endTime}` : undefined,
              description: result.eventDescription,
              extendedProps: {
                startTime: result.startTime,
                eventTime: result.eventTime
              }
            }];
          },
          (error) => {
            this.errorMessage = error.message;
          }
        );
      }
    });
  }

  handleEventClick(info: any) {
    const dialogRef = this.dialog.open(EventDetailDialogComponent, {
      width: '300px',
      data: { event: info.event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.delete) {
        this.scheduleService.deleteSchedule(this.groupId, info.event.id).then(
          () => {
            info.event.remove();
          },
          (error) => {
            this.errorMessage = error.message;
          }
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/groups']); // Navigate back to groups
  }
}
