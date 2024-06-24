import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GroupComponent } from './group/group.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { GroupService } from './services/group.service';
import { ScheduleService } from './services/schedule.service';
import { ChatService } from './services/chat.service';
import { AuthGuard } from './auth.guard';
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {HomeComponent} from "./home/home.component";
import { FullCalendarModule } from '@fullcalendar/angular';
import {EventDialogComponent} from "./event-dialog/event-dialog.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatDialogContent, MatDialogModule, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {EventDetailDialogComponent} from "./event-detail-dialog/event-detail-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GroupComponent,
    ScheduleComponent,
    FileUploadComponent,
    GroupChatComponent,
    HomeComponent,
    EventDialogComponent,
    EventDetailDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule,
    FullCalendarModule,
    MatDialogContent,
    MatFormField,
    BrowserAnimationsModule,
    MatDialogTitle,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule

  ],
  providers: [
    AuthService,
    GroupService,
    ScheduleService,
    ChatService,
    AuthGuard,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
