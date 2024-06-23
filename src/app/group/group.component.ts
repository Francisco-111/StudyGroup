import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groups: any[] = [];
  userEmail: string | null = '';
  groupName: string = '';
  searchQuery: string = ''; // Add property for search query
  createGroupErrorMessage: string = '';
  successMessage: string = ''; // Add property for success message
  isProcessing: boolean = false; // Add a flag to manage button state
  private searchSubject: Subject<string> = new Subject();

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.user$.subscribe(user => {
      this.userEmail = user?.email || '';
    });
  }

  ngOnInit() {
    this.groupService.getGroups().subscribe((data: any) => {
      this.groups = data;
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  onCreateGroup() {
    if (this.userEmail && this.groupName.trim()) {
      this.isProcessing = true;
      this.groupService.createGroup(this.groupName, this.userEmail).then(() => {
        this.groupName = '';
        this.displaySuccessMessage(`Group "${this.groupName}" was created`);
      }).catch(error => {
        this.createGroupErrorMessage = error.message;
        this.isProcessing = false;
      });
    }
  }

  joinGroup(groupId: string) {
    if (this.userEmail && !this.isProcessing) {
      this.isProcessing = true;
      this.groupService.joinGroup(groupId, this.userEmail).then(() => {
        this.displaySuccessMessage('Joined group successfully!');
      }).catch(error => {
        console.error('Error joining group:', error);
        this.isProcessing = false;
      });
    }
  }

  leaveGroup(groupId: string) {
    if (this.userEmail && !this.isProcessing) {
      this.isProcessing = true;
      this.groupService.leaveGroup(groupId, this.userEmail).then(() => {
        this.displaySuccessMessage('Left group successfully!');
      }).catch(error => {
        console.error('Error leaving group:', error);
        this.isProcessing = false;
      });
    }
  }

  displaySuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
      this.isProcessing = false;
    }, 3000); // Add a delay before resetting isProcessing
  }

  clearSuccessMessage() {
    this.successMessage = '';
    this.isProcessing = false;
  }

  navigateToGroupChat(groupId: string) {
    this.router.navigate(['/groups', groupId, 'chat']);
  }

  navigateToGroupSchedules(groupId: string) {
    this.router.navigate(['/groups', groupId, 'schedules']);
  }

  navigateToFileUpload(groupId: string) {
    this.router.navigate(['/groups', groupId, 'file-upload']);
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  performSearch(query: string) {
    if (query.trim()) {
      this.groupService.searchGroups(query).subscribe((data: any) => {
        this.groups = data;
      });
    } else {
      this.groupService.getGroups().subscribe((data: any) => {
        this.groups = data;
      });
    }
  }
}
