import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groups: any[] = [];
  userEmail: string | null = '';
  groupName: string = '';
  createGroupErrorMessage: string = '';

  constructor(private groupService: GroupService, private authService: AuthService) {
    this.authService.afAuth.authState.subscribe(user => {
      this.userEmail = user?.email || '';
    });
  }

  ngOnInit() {
    this.groupService.getGroups().subscribe((data: any) => {
      this.groups = data;
    });
  }

  onCreateGroup() {
    if (this.userEmail && this.groupName.trim()) {
      this.groupService.createGroup(this.groupName, this.userEmail).then(() => {
        this.groupName = '';
      }).catch(error => {
        this.createGroupErrorMessage = error.message;
      });
    }
  }

  joinGroup(groupId: string) {
    if (this.userEmail) {
      this.groupService.joinGroup(groupId, this.userEmail).then(() => {
        alert('Joined group successfully!');
      }).catch(error => {
        console.error('Error joining group:', error);
      });
    }
  }

  leaveGroup(groupId: string) {
    if (this.userEmail) {
      this.groupService.leaveGroup(groupId, this.userEmail).then(() => {
        alert('Left group successfully!');
      }).catch(error => {
        console.error('Error leaving group:', error);
      });
    }
  }
}
