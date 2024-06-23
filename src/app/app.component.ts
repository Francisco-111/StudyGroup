import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userLoggedIn: boolean = false;
  user$: Observable<firebase.User | null>;
  isNavOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    this.authService.afAuth.authState.subscribe(user => {
      this.userLoggedIn = !!user;
    });
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
}
