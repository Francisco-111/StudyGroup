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
import { DirectChatComponent } from './direct-chat/direct-chat.component';
import { UserListComponent } from './user-list/user-list.component';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { GroupService } from './services/group.service';
import { ScheduleService } from './services/schedule.service';
import { ChatService } from './services/chat.service';
import { UserService } from './services/user.service';
import { AuthGuard } from './auth.guard';
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GroupComponent,
    ScheduleComponent,
    FileUploadComponent,
    GroupChatComponent,
    DirectChatComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [
    AuthService,
    GroupService,
    ScheduleService,
    ChatService,
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
