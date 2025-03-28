import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GroupComponent } from './group/group.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'groups', component: GroupComponent, canActivate: [AuthGuard] },
  { path: 'groups/:id/chat', component: GroupChatComponent, canActivate: [AuthGuard] },
  { path: 'groups/:id/file-upload', component: FileUploadComponent , canActivate: [AuthGuard] },
  { path: 'groups/:id/schedules', component: ScheduleComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
