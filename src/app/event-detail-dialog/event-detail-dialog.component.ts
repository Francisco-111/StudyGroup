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
  endTime: string = 'N/A';
  eventDescription: string = 'N/A';
  scheduledBy: string = 'N/A'; // New property

  constructor(
    public dialogRef: MatDialogRef<EventDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const event = this.data.event;
    this.eventName = event.title;
    this.eventDate = new Date(event.start).toISOString().split('T')[0];
    this.eventTime = event.extendedProps.eventTime || 'N/A';
    this.startTime = event.extendedProps.startTime || 'N/A';
    this.endTime = (event.end && event.end.split('T')[1]) ? event.end.split('T')[1].slice(0, 5) : 'N/A';
    this.eventDescription = event.extendedProps.description || 'N/A';
    this.scheduledBy = event.extendedProps.scheduledBy || 'N/A';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.dialogRef.close({ delete: true });
  }
}
