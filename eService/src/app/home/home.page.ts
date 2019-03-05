import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/models/user';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: '',
  };

  login = false;

  constructor(
    private route: Router,
    private auth: AuthService,
    public afAuth: AngularFireAuth) { }


  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.route.navigateByUrl('/profile');
    }
  }

  signIn() {
    this.login = !this.login;
  }

  signinWithEmailAndPassword() {
    this.auth.SignInWithEmailAndPassword(this.user.email, this.user.password).then(() => {
      this.route.navigateByUrl('/profile');
    }).catch(err => {
      console.log(err);
    });
  }

  signupWithEmailAndPassword() {
    this.auth.SignUpWithEmailAndPassword(this.user.email, this.user.password).then(() => {
      this.auth.UpdateUser(this.user).then(() => {
        this.route.navigateByUrl('/profile');
      });
    }).catch(err => {
      console.log(err);
    });
  }

  // loginWithFacebook() {
  //   this.auth.FacebookAuth().then(res => {
  //     console.log('Success');
  //     this.auth.UpdateUser(this.user.uid, this.user);
  //     this.route.navigateByUrl('/profile');
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  // loginWithGoogle() {
  //   this.auth.GoogleAuth().then(res => {
  //     console.log('Success');
  //     this.auth.UpdateUser(this.user.uid, this.user);
  //     this.route.navigateByUrl('/profile');
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }
}
