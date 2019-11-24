import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { take } from 'rxjs/operators';
import { AuthProvider } from '../../providers/auth/auth';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION, EVENTS, USER_TYPE } from '../../utils/consts';
import { DataProvider } from '../../providers/data/data';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../config';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserData } from '../../models/userData';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import firebase from 'firebase/app';
import { UsersPage } from '../users/users';
import { Observable } from 'rxjs';
import { DashboardPage } from '../dashboard/dashboard';

declare var window;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  data = {
    email: '',
    password: '',
    phone: '',
    otp: ''
  }
  type = 'password';
  showPass = false;

  user: any;

  verificationId: any;
  otpCode: string = '';

  loginType: string = 'EmailAndPassword';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ionEvents: Events,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider,
    private platform: Platform) {
  }

  ionViewDidLoad() {
    if (this.authProvider.isLoggedIn() && this.authProvider.getStoredUserId()) {
      this.navigate(this.authProvider.getStoredUserId());
    }
  }


  signInWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.feedbackProvider.dismissLoading();
      this.authProvider.storeUser(this.authProvider.afAuth.auth.currentUser.uid);
      this.navigate(this.authProvider.afAuth.auth.currentUser.uid);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentAlert('Login failed', 'The email and password entered do not match');
      console.log(err);
    })
  }

  navigate(id: string) {
    const userSubscription = this.dataProvider.getUserById(id).subscribe(res => {
      console.log(res);
      if (res.userType === USER_TYPE.seller) {
        this.navCtrl.setRoot(DashboardPage);
      } else {
        this.navCtrl.setRoot(UsersPage);
      }
    });
    setTimeout(() => userSubscription.unsubscribe(), 3000);
  }
  signInWithFacebook() {
    this.authProvider.signInWithFacebook().then((r) => {
      console.log(r);
    }).catch(err => {
      console.log(err);

    })
  }

  signInWithGoogle() {
    this.authProvider.signInWithGoogle().then((r) => {
      console.log(r);
    }).catch(err => {
      console.log(err);

    })
  }


  goToSignup() {
    this.navCtrl.setRoot(SignupPage);
  }

  signinWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(() => {
        this.feedbackProvider.dismissLoading();
        this.navCtrl.setRoot(UsersPage);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username and password do not match');
      }
      console.log(err);
    });
  }

  goToForgotPassword() {
    console.log('forgot password');
  }

  // sendEmail() {
  //   const name = 'Harry';
  //   const email = 'set.harry@gmail.com';
  //   const message = 'Lets see how it goes';
  //   const date = this.dataProvider.getNowDate();
  //   let formRequest = { name, email, message, date };
  //   this.authProvider.afs.collection('/otp').add(formRequest);
  // }

  // signInWithFacebook() {
  //   this.feedbackProvider.presentLoading();
  //   this.authProvider.signInWithFacebook().then((res) => {
  //     this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
  //       this.feedbackProvider.dismissLoading();
  //       this.navigate(u);
  //     });
  //   }).catch(err => {
  //     this.feedbackProvider.dismissLoading();
  //     if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
  //       this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
  //     }
  //     console.log(err);
  //   });
  // }

  // signInWithTwitter() {
  //   this.feedbackProvider.presentLoading();
  //   this.authProvider.signInWithFacebook().then((res) => {
  //     this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
  //       this.feedbackProvider.dismissLoading();
  //       this.navigate(u);
  //     });
  //   }).catch(err => {
  //     this.feedbackProvider.dismissLoading();
  //     if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
  //       this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
  //     }
  //     console.log(err);
  //   });
  // }


  // navigate(user) {
  //   this.feedbackProvider.presentLoading();
  //   this.authProvider.storeUser(user);
  //   forkJoin(
  //     this.dataProvider.getAllFromCollection(COLLECTION.users).pipe(take(1))
  //   ).subscribe(([users, jobs, appointments, ratings, viewedJobs, appliedJobs, sharedJobs]) => {
  //     this.feedbackProvider.dismissLoading();
  //     const data = { users, jobs, appointments, ratings, viewedJobs, appliedJobs, sharedJobs };
  //     this.dataProvider.updateUserData(new UserData(data));
  //     this.ionEvents.publish(EVENTS.loggedIn, user);
  //   });
  // }

  // goToSignup() {
  //   this.navCtrl.setRoot(SignupPage);
  // }

  // goToForgotPassword() {
  //   this.navCtrl.setRoot(ForgotPasswordPage);
  // }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
