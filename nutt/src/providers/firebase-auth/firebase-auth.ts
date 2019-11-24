import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { User } from '../../models/user';

@Injectable()
export class FirebaseAuthProvider {
  profile: User;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
  ) {
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user'));
    //   } else {
    //     localStorage.setItem('user', null);
    //     JSON.parse(localStorage.getItem('user'));
    //   }
    // });
  }

  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  signInWithTwitter() {
    return this.authLogin(new auth.TwitterAuthProvider());
  }

  signInWithFacebook() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmailAndPassword(user: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res => {
      this.updateUser(user);
    });
  }

  signUpWithPhonenumber(phoneNumber, appVerifier) {
    this.afAuth.auth.signInWithPhoneNumber(phoneNumber, appVerifier).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
  updateUser(data: User) {
    const user = this.getStoredUser();
    const userData = {};
    return this.afs.collection('users').doc(user.uid).set(userData);
  }

  getUser(uid): any {
    return this.afs.collection('users').doc(uid).get();
  }

  storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  signOut() {
    localStorage.removeItem('user');
    return this.afAuth.auth.signOut();
  }


}
