import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import firebase from "firebase/compat/app";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  user$: Observable<firebase.User | null>;

  constructor(protected authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {}
}
