import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent implements OnInit {

  eventName: string = '';
  eventTime: string | null = null;
  startTime: string | null = null;
  endTime: string | null = null;
  eventDescription: string = '';
  currentDate: string = new Date().toISOString().split('T')[0];
  currentTime: string = new Date().toTimeString().substring(0, 5);
  errorMessage: string = '';
  enableEndTime: boolean = false;
  bindEventToStartTime: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data.eventDate === this.currentDate) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      this.endTime = now.toTimeString().substring(0, 5);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateTimes(): boolean {
    if (!this.eventName.trim()) {
      this.errorMessage = 'Event name is required.';
      return false;
    }

    if (this.data.eventDate === this.currentDate) {
      const now = new Date();
      const selectedEventTime = this.eventTime ? new Date(`${this.data.eventDate}T${this.eventTime}`) : null;
      const selectedStartTime = this.startTime ? new Date(`${this.data.eventDate}T${this.startTime}`) : null;

      if (selectedEventTime && selectedEventTime < now) {
        this.errorMessage = 'Event time cannot be in the past.';
        return false;
      }
      if (selectedStartTime && selectedStartTime < now) {
        this.errorMessage = 'Start time cannot be in the past.';
        return false;
      }
    }

    if (this.endTime && this.startTime && this.endTime < this.startTime) {
      this.errorMessage = 'End time cannot be before start time.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  onSave(): void {
    // Use 'N/A' if the user did not provide input
    const schedule = {
      eventName: this.eventName,
      eventDate: this.data.eventDate,
      eventTime: this.eventTime || 'N/A',
      startTime: this.startTime || 'N/A',
      endTime: (this.endTime && this.endTime !== new Date().toTimeString().substring(0, 5)) ? this.endTime : 'N/A',
      eventDescription: this.eventDescription || 'N/A'
    };

    if (this.validateTimes()) {
      this.dialogRef.close(schedule);
    }
  }

  onEventTimeChange(): void {
    if (this.data.eventDate === this.currentDate && this.eventTime && this.eventTime < this.currentTime) {
      this.errorMessage = 'Event time cannot be before the current time.';
      this.eventTime = '';
      return;
    }
    this.errorMessage = '';
    this.startTime = this.eventTime;
    this.enableEndTime = !!this.eventTime;
    this.bindEventToStartTime = true;
  }

  onStartTimeChange(): void {
    if (this.data.eventDate === this.currentDate && this.startTime && this.startTime < this.currentTime) {
      this.errorMessage = 'Start time cannot be before the current time.';
      this.startTime = '';
      this.enableEndTime = false;
      return;
    }
    this.errorMessage = '';
    this.enableEndTime = !!this.startTime;
    if (!this.startTime) {
      this.endTime = '';
    }
    if (this.bindEventToStartTime) {
      this.eventTime = this.startTime;
    }
  }

  onEndTimeChange(): void {
    if (!this.endTime) {
      this.enableEndTime = false;
    }
  }
}
