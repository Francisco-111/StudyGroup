import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private storage: AngularFireStorage,private firestore: AngularFirestore, private authService: AuthService) {}

  uploadFile(filePath: string, file: File): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // @ts-ignore
    return task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL())
    );
  }

  getUserFiles(userId: string): Observable<any[]> {
    return this.firestore.collection('files', ref => ref.where('uploadedBy', '==', userId)).valueChanges();
  }
}
