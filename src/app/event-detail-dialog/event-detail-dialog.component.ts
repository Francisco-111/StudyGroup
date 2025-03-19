import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-detail-dialog',
  templateUrl: './event-detail-dialog.component.html',
  styleUrls: ['./event-detail-dialog.component.css']
})
export class EventDetailDialogComponent implements OnInit {

  eventName: string = '';
  eventDate: string = '';
  eventTime: string = 'N/A';
  startTime: string = 'N/A';
  endTime: string = 'N/A'
  eventDescription: string = 'N/A';
  scheduledBy: string = 'N/A';

  constructor(
    public dialogRef: MatDialogRef<EventDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const event = this.data.event;
    this.eventName = event.title;
    this.eventDate = new Date(event.start).toISOString().split('T')[0];

    if (event.extendedProps) {
      this.eventTime = this.validateAndFormatTime(event.extendedProps.eventTime);
      this.startTime = this.validateAndFormatTime(event.extendedProps.startTime);
      this.eventDescription = event.extendedProps.description || 'N/A';
      this.scheduledBy = event.extendedProps.scheduledBy || 'N/A';
    }

    if (event.end) {
      this.endTime = this.validateAndFormatTime(this.extractTimeFromDate(event.end));
    }
  }

  extractTimeFromDate(date: any): string {
    if (typeof date === 'string') {
      const timePart = date.split('T')[1];
      return timePart ? timePart.slice(0, 5) : '';
    } else if (date instanceof Date) {
      return date.toTimeString().slice(0, 5);
    }
    return '';
  }

  validateAndFormatTime(time: string | undefined): string {
    if (!time || !this.isValidTimeFormat(time)) {
      return 'N/A';
    }
    return this.formatTo12Hour(time);
  }

  isValidTimeFormat(time: string): boolean {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return false;
    }
    const [hours, minutes] = timeParts.map(Number);
    return !isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
  }

  formatTo12Hour(time: string): string {
    let [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${this.padZero(hours)}:${this.padZero(minutes)} ${period}`;
  }

  padZero(num: number): string {
    if (num === undefined || num === null) return '00';
    return num < 10 ? '0' + num : num.toString();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.dialogRef.close({ delete: true });
  }
}
