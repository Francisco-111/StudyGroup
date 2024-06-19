import { Component } from '@angular/core';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  errorMessage: string = '';

  constructor(private fileService: FileService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUploadFile() {
    if (this.selectedFile) {
      const filePath = 'uploads/' + this.selectedFile.name;
      this.fileService.uploadFile(filePath, this.selectedFile).subscribe(
        (url: string) => {
          this.downloadURL = url;
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }
}
