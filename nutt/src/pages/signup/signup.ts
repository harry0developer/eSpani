import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { UsersPage } from '../users/users';
import * as moment from 'moment'
import { LoginPage } from '../login/login';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupType = 'EmailAndPassword';
  data: User = {
    email: "",
    password: "",
    nickname: "",
    avatar: "",
    dob: "",
    gender: "",
    race: "",
    cell: "",
    userType: "",
    dateCreated: "",
    status: "",
    body: {
      height: 125,
      measure: "m",
      skinColor: "dark",
      type: "slim"
    },
    location: {
      address: "",
      geo: {
        lat: 0,
        lng: 0
      }
    },
  };
  minYear: string;
  constructor(public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
  ) {
  }

  ionViewDidLoad() {
    const date = this.dataProvider.getNowDate();
    const year = +date.split('/')[0] - 17;
    this.minYear = year.toString();
  }

  dummyReg() {
    this.data = {
      email: "thato@test.com",
      password: "123456",
      nickname: "Slim Tee",
      avatar: "assets/imgs/users/user5.jpg",
      dob: "1998/12/18",
      gender: "female",
      race: "black",
      userType: "seller",
      dateCreated: "2019/05/14",
      status: "online",
      cell: "0829901212",
      body: {
        height: 123,
        measure: "m",
        skinColor: "light",
        type: "slim"
      },
      location: {
        address: '190 Main stream road, Brackpan, Johannesburg',
        geo: {
          lat: -25.126960,
          lng: 28.352910
        }
      }
    };
    this.feedbackProvider.presentLoading();
    this.authProvider.signUpWithEmailAndPassword(this.data).then(() => {
      this.authProvider.updateUser(this.data).then(() => {
        this.feedbackProvider.dismissLoading();
        this.sendVerification();
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        console.log(err);
      })
    });
  }

  signupWithEmailAndPassword() {
    this.data.location = {
      address: '9990 Kwagga stree, Lynwood city, Pretoria',
      geo: {
        lat: -25.756960,
        lng: 28.252910
      }
    };
    this.data.userType = "seller";

    this.data.avatar = `assets/imgs/users/${this.data.gender}.svg`;
    this.data.dateCreated = this.dataProvider.getNowDate();
    this.authProvider.signUpWithEmailAndPassword(this.data).then(() => {
      this.authProvider.updateUser(this.data).then(() => {
        this.sendVerification();
      }).catch(err => {
        console.log(err);
      })
    });
  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

  sendVerification() {
    this.authProvider.afAuth.auth.currentUser.sendEmailVerification().then(res => {
      console.log(res);
      this.navCtrl.setRoot(UsersPage);
    }).catch(err => {
      console.log(err);

    })
  }
}
