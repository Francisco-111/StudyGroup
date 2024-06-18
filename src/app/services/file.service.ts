import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private storage: AngularFireStorage) {}

  uploadFile(filePath: string, file: File): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // @ts-ignore
    return task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL())
    );
  }

  listFiles(uploads: string) {
    
  }
}
