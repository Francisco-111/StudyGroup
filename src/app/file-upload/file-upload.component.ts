import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() groupId: string = '';
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  userEmail: string | null = '';
  files: any[] = [];
  errorMessage: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;
  showFileOptions: boolean = false;
  filesWithSameName: any[] = [];
  selectedFilesToDelete: Set<string> = new Set();
  userFilesToDelete: Set<string> = new Set();
  enableDeleteMode: boolean = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.checkForExistingFile();
  }

  checkForExistingFile() {
    if (this.selectedFile && this.userEmail) {
      this.filesWithSameName = this.files.filter(f => f.name === this.selectedFile!.name && f.uploadedBy === this.userEmail);
      if (this.filesWithSameName.length > 0) {
        this.showFileOptions = true;
      } else {
        this.showFileOptions = false;
      }
    }
  }

  hasUserUploadedFiles(): boolean {
    return this.files.some(file => file.uploadedBy === this.userEmail);
  }

  toggleFileSelection(fileId: string) {
    if (this.selectedFilesToDelete.has(fileId)) {
      this.selectedFilesToDelete.delete(fileId);
    } else {
      this.selectedFilesToDelete.add(fileId);
    }
  }

  toggleUserFileSelection(fileId: string) {
    if (this.userFilesToDelete.has(fileId)) {
      this.userFilesToDelete.delete(fileId);
    } else {
      this.userFilesToDelete.add(fileId);
    }
  }

  canOverwrite(): boolean {
    return this.selectedFilesToDelete.size > 0;
  }

  canDeleteUserFiles(): boolean {
    return this.userFilesToDelete.size > 0;
  }

  onUploadFile(overwrite: boolean = false) {
    if (this.selectedFile && this.userEmail && !this.isUploading) {
      this.isUploading = true; // Disable button while uploading
      if (overwrite && this.selectedFilesToDelete.size > 0) {
        this.deleteSelectedFiles().then(() => {
          this.uploadFile(this.selectedFile!, `groups/${this.groupId}/files/${this.selectedFile!.name}`, true);
        }).catch(error => {
          this.errorMessage = error.message;
          this.isUploading = false;
        });
      } else {
        this.uploadFile(this.selectedFile, `groups/${this.groupId}/files/${new Date().getTime()}_${this.selectedFile.name}`, false);
      }
      this.showFileOptions = false;
    }
  }

  onDeleteUserFiles() {
    if (this.userFilesToDelete.size > 0) {
      this.deleteSelectedUserFiles().then(() => {
        this.userFilesToDelete.clear();
        this.loadFiles();
        this.enableDeleteMode = false; // Hide checkboxes and revert button text
      }).catch(error => {
        this.errorMessage = error.message;
      });
    }
  }

  cancelUpload() {
    this.selectedFile = null;
    this.showFileOptions = false;
    this.selectedFilesToDelete.clear();
    this.resetFileInput();
  }

  cancelUserFileDeletion() {
    this.userFilesToDelete.clear();
    this.enableDeleteMode = false;
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteSelectedFiles() {
    const deletePromises: any[] = [];
    this.selectedFilesToDelete.forEach(fileId => {
      deletePromises.push(this.chatService.deleteFileRecord(this.groupId, fileId));
    });
    return Promise.all(deletePromises).then(() => {
      console.log('All selected files have been deleted from Firestore.');
    }).catch(error => {
      console.error('Error deleting selected files from Firestore:', error);
    });
  }

  deleteSelectedUserFiles() {
    const deletePromises: any[] = [];
    this.userFilesToDelete.forEach(fileId => {
      deletePromises.push(this.chatService.deleteFileRecord(this.groupId, fileId));
    });
    return Promise.all(deletePromises).then(() => {
      console.log('All selected user files have been deleted from Firestore.');
    }).catch(error => {
      console.error('Error deleting selected user files from Firestore:', error);
    });
  }

  uploadFile(file: File, filePath: string, overwrite: boolean) {
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
            this.resetFileInput(); // Reset file input
            this.isUploading = false; // Re-enable button after upload
          }).catch(error => {
            this.errorMessage = error.message;
            this.isUploading = false; // Re-enable button in case of error
          });
        });
      })
    ).subscribe();
  }

  goBackToGroups() {
    this.router.navigate(['/groups']); // Navigate to the groups route
  }

  toggleDeleteMode() {
    this.enableDeleteMode = !this.enableDeleteMode;
    if (!this.enableDeleteMode) {
      this.userFilesToDelete.clear();
    }
  }
}
