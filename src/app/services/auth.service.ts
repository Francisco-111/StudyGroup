import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(public afAuth: AngularFireAuth) { }

    login(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    register(email: string, password: string) {
        return this.afAuth.createUserWithEmailAndPassword(email, password);
    }

    logout() {
        return this.afAuth.signOut();
    }
}
