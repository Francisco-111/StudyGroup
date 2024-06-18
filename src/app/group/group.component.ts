import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupName: string = '';
  members: string = '';
  errorMessage: string = '';
  groups: any[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    this.groupService.getGroups().subscribe((data: any) => {
      this.groups = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

  onCreateGroup() {
    const membersArray = this.members.split(',').map(email => email.trim());
    this.groupService.createGroup(this.groupName, membersArray).then(
      () => {
        this.groupName = '';
        this.members = '';
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
}
