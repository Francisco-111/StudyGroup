import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() groupId: string = '';
  userEmail: string | null = '';
  files: any[] = [];
  errorMessage: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage
  ) {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.afAuth.authState.subscribe(user => {
      this.userEmail = user?.email || '';
    });
  }

  ngOnInit() {
    if (this.groupId) {
      this.loadFiles();
    }
  }

  loadFiles() {
    this.chatService.getFiles(this.groupId).subscribe((data: any) => {
      this.files = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUploadFile() {
    if (this.selectedFile && this.userEmail && !this.isUploading) {
      this.isUploading = true; // Disable button while uploading
      const file = this.selectedFile;
      const filePath = 'groups/' + this.groupId + '/files/' + file.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            const fileRecord = {
              name: file.name,
              url: url,
              uploadedBy: this.userEmail,
              timestamp: new Date()
            };
            this.chatService.addFileRecord(this.groupId, fileRecord).then(() => {
              this.selectedFile = null;
              this.loadFiles(); // Refresh the file list
              this.isUploading = false; // Re-enable button after upload
            }).catch(error => {
              this.errorMessage = error.message;
              this.isUploading = false; // Re-enable button in case of error
            });
          });
        })
      ).subscribe();
    }
  }
}
