import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { GroupService } from '../services/group.service';
import { FileService } from '../services/file.service';
import { ScheduleService } from '../services/schedule.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
  userEmail: string | null = null;
  groups$: Observable<any[]> | undefined;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private groupService: GroupService,
    private fileService: FileService,
    private scheduleService: ScheduleService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userEmail = user.email;

        if (this.userEmail) {
          this.groups$ = this.groupService.getUserGroups(this.userEmail).pipe(
            switchMap(groups => {
              if (groups.length === 0) {
                return of(groups);  // Return an empty array if no groups
              }

              const groupObservables = groups.map(group =>
                combineLatest([
                  this.chatService.getMessages(group.id).pipe(
                    map(chats => chats.map(chat => ({
                      ...chat,
                      timestamp: this.datePipe.transform(chat.timestamp?.seconds * 1000, 'MM/dd/yyyy, hh:mm:ss a')
                    }))),
                    catchError(err => of([]))
                  ),
                  this.chatService.getFiles(group.id).pipe(
                    map(files => files.map(file => ({
                      ...file,
                      timestamp: this.datePipe.transform(file.timestamp?.seconds * 1000, 'MM/dd/yyyy, hh:mm:ss a')
                    }))),
                    catchError(err => of([]))
                  ),
                  this.scheduleService.getSchedules(group.id).pipe(
                    map(schedules => {
                      console.log(`Schedules for group ${group.id}:`, schedules);
                      return schedules.map(schedule => ({
                        ...schedule,
                        eventDate: schedule.eventDate ? this.datePipe.transform(schedule.eventDate, 'MM/dd/yyyy') : 'N/A',
                        eventTime: schedule.eventTime ? this.datePipe.transform(schedule.eventTime, 'hh:mm:ss a') : 'N/A',
                        startTime: schedule.startTime ? this.datePipe.transform(schedule.startTime, 'hh:mm:ss a') : 'N/A',
                        endTime: schedule.endTime ? this.datePipe.transform(schedule.endTime, 'hh:mm:ss a') : 'N/A'
                      }));
                    }),
                    catchError(err => of([]))
                  )
                ]).pipe(
                  map(([chats, files, schedules]) => ({ ...group, chats, files, schedules }))
                )
              );

              return combineLatest(groupObservables).pipe(
                map(results => {
                  console.log('Final combined results:', results);
                  this.cd.detectChanges();
                  return results;
                })
              );
            }),
            catchError(err => {
              console.error('Error fetching groups:', err);
              return of([]);
            })
          );
        }
      }
    });
  }
}
