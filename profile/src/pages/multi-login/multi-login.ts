import { Component } from '@angular/core';
import { NavController, Events, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/const';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DashboardPage } from '../dashboard/dashboard';
import { DataProvider } from '../../providers/data/data';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../firebase-config';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import * as firebase from 'firebase';
import { WindowProvider } from '../../providers/window/window';
import { MultiSignupPage } from '../multi-signup/multi-signup';
import { NationalityPage } from '../nationality/nationality';
import { Country } from '../../models/country';
import { take } from 'rxjs/operators';
import { User } from '../../models/user';
import { Service } from '../../models/service';

@Component({
  selector: 'page-multi-login',
  templateUrl: 'multi-login.html',
})
export class MultiLoginPage {

  loginType: string = 'phoneNumber';
  data = {
    email: '',
    password: '',
    otpCode: '',
    phonenumber: '',
    code: ''
  }
  type = 'password';
  showPass = false;
  showOTPPage = false;
  verificationId: string = '';

  // user: any;
  applicationVerifier: any;
  windowRef: any;
  verificationCode: string;
  countries: any = [];
  users: User[] = [];


  country: Country = {
    name: "South Africa",
    flag: "🇿🇦",
    code: "ZA",
    dialCode: "+27"
  };

  constructor(
    private navCtrl: NavController,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
    private ionEvents: Events,
    private win: WindowProvider
  ) { }

  ionViewDidLoad() {

    this.dataProvider.getAllFromCollection(COLLECTION.users).pipe(take(1)).subscribe(users => {
      this.users = users;
    });

    if (this.authProvider.isLoggedIn() && this.authProvider.getStoredUser()) {
      this.navigate(this.authProvider.getStoredUser());
    } else {
      this.windowRef = this.win.windowRef
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
      });

      if (this.windowRef && this.windowRef.recaptchaVerifier) {
        this.windowRef.recaptchaVerifier.render().then(widgetId => {
          this.windowRef.recaptchaWidgetId = widgetId;
        }).catch(err => {
          console.log(err);
        });
      } else {
        console.log('reCapture error');

      }
    }

  }

  getCountryCode() {
    let modal = this.modalCtrl.create(NationalityPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.country.name = data.name;
        this.country.dialCode = data.dial_code;
        this.country.flag = data.flag;
      }
    });
    modal.present();
  }

  signinWithPhonenumber() {
    // const appVerifier = this.windowRef.recaptchaVerifier;
    // const num = this.country.dialCode + this.data.phonenumber;
    // if (this.isRegistered()) {
    //   this.feedbackProvider.presentLoading();
    //   this.authProvider.signInWithPhoneNumber(num, appVerifier).then(result => {
    //     this.windowRef.confirmationResult = result;
    //     // console.log('sms sent', result);
    //     this.showOTPPage = true;
    //     this.feedbackProvider.dismissLoading();
    //   }).catch(() => {
    //     this.feedbackProvider.dismissLoading();
    //     this.feedbackProvider.presentToast("Oops, something went wrong sending sms");
    //   });
    // } else {
    //   this.feedbackProvider.presentAlert("Login failed", "Phone number provided is not registered. Please signup");
    // }

  }

  // isRegistered(): boolean {
  //   const num = this.country.dialCode + this.data.phonenumber;

  //   for (let i = 0; i < this.users.length; i++) {
  //     if (this.users[i] && this.users[i].phonenumber && this.users[i].phonenumber.includes(num.substr(4, 15))) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  addUser() {
    const user: User = {
      uid: "E2VprUJr2QWeV6ZJeVgxQxHMhHs1",
      email: 'james@test.com',
      firstname: 'James',
      lastname: 'Williamson',
      dob: '1986/02/22',
      gender: 'male',
      race: 'white',
      phone: '+27821001060',
      location: {
        address: '101 Drooison min straat, Free state',
        geo: {
          lat: 21.200,
          lng: -19.2122
        }
      },
      dateCreated: this.dataProvider.getDateTime(),
      settings: {
        hide_dob: false,
        hide_email: false,
        hide_phone: false,
      }
    }
    this.dataProvider.addNewItemWithId(COLLECTION.users, user, user.uid).then(() => {
      console.log('added');
    });
  }

  addService() {
    const service: Service = {
      title: 'We feed, You celebrate',
      description: 'We are feed young and old at all sorts of events, we are popular for feeding weddings, funerals and all other ceremonies',
      category: 'Beauty & Spa',
      services: ["funerals", "office", "other events", "weddings", "other"],
      dateCreated: this.dataProvider.getDateTime(),
      company: "Phutilicious Catering Co.",
      location: {
        address: '440 Cosmocity ext 9, Johannesburg',
        geo: {
          lat: 21.200,
          lng: -19.2122
        }
      },
      uid: 'w4hqPS2ZlSNWQG611OqbDOJhcHP2'
    }

    this.dataProvider.addNewItem(COLLECTION.services, service).then(() => {
      console.log('added');
    });
  }

  verifyLoginCode() {
    this.feedbackProvider.presentLoading();
    this.windowRef.confirmationResult.confirm(this.data.otpCode).then(u => {
      this.getDatabaseUserAndNavigate(u.user);
    }).catch(error => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('OTP code error', 'The OTP code entered does not match the one sent to you by sms');
      // console.log(error, "Incorrect code entered?");
    });
  }

  signinWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.dataProvider.getUserById(res.user.uid).pipe(take(1)).subscribe(user => {
        this.feedbackProvider.dismissLoading();
        this.navigate(user);
      }, err => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('Oops, something went wrong');
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithFacebook() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithFacebook().then((res) => {
      this.feedbackProvider.dismissLoading();
      console.log(res);

      this.getDatabaseUserAndNavigate(res.user);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithTwitter() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithFacebook().then((res) => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.feedbackProvider.dismissLoading();
        this.navigate(u);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  getDatabaseUserAndNavigate(user: firebase.User) {
    this.dataProvider.getItemById(COLLECTION.users, user.uid).subscribe(u => {
      this.feedbackProvider.dismissLoading();
      this.navigate(u);
    }, err => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Oops, something went wrong');
    });
  }

  navigate(user) {
    this.ionEvents.publish(EVENTS.loggedIn, user);
    this.authProvider.storeUser(user);
    this.navCtrl.setRoot(DashboardPage);
  }

  cancelOtpVerification() {
    this.showOTPPage = false;
  }


  goToSignup() {
    this.navCtrl.setRoot(MultiSignupPage);
  }

  goToForgotPassword() {
    this.navCtrl.setRoot(ForgotPasswordPage);
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

} 