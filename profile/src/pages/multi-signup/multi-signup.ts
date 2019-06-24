import { Component } from '@angular/core';
import { NavController, Events, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { USER_TYPE, EVENTS } from '../../utils/const';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DashboardPage } from '../dashboard/dashboard';
import { DataProvider } from '../../providers/data/data';
import * as firebase from 'firebase';
import { WindowProvider } from '../../providers/window/window';
import { NationalityPage } from '../nationality/nationality';
import { Country } from '../../models/country';
import { User } from '../../models/user';
import { SetupPage } from '../setup/setup';
import { MultiLoginPage } from '../multi-login/multi-login';

@Component({
  selector: 'page-multi-signup',
  templateUrl: 'multi-signup.html',
})
export class MultiSignupPage {
  loginType: string = 'phoneNumber';
  data = {
    email: '',
    password: '',
    otpCode: '',
    phonenumber: '',
    firstname: '',
    lastname: ''
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
  phoneOTP: boolean = false;


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

  signupWithPhonenumber() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.country.dialCode + this.data.phonenumber;
    if (this.isPhoneNumberRegistered()) {
      this.feedbackProvider.presentAlert("Signup failed", "Phone number provided is already registered. Please login");
    } else {
      this.feedbackProvider.presentLoading();
      this.authProvider.signInWithPhoneNumber(num, appVerifier).then(result => {
        this.windowRef.confirmationResult = result;
        this.showOTPPage = true;
        this.phoneOTP = true;
        this.feedbackProvider.dismissLoading();
      }).catch(() => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast("Oops, something went wrong sending sms");
      });
    }
  }

  signupWithEmailAndPassword() {
    if (this.isEmailAddressRegistered()) {
      this.feedbackProvider.presentAlert("Signup failed", "Email address provided is already registered. Please Login");
    } else {
      this.feedbackProvider.presentModal(SetupPage, { data: this.data });
    }
  }

  isPhoneNumberRegistered(): boolean {
    return false;
    // const num = this.country.dialCode + this.data.phonenumber;

    // for (let i = 0; i < this.users.length; i++) {
    //   if (this.users[i] && this.users[i].phonenumber && this.users[i].phonenumber.includes(num.substr(4, 15))) {
    //     return true;
    //   }
    // }
    // return false;
  }

  isEmailAddressRegistered(): boolean {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] && this.users[i].email && this.data.email && this.users[i].email === this.data.email.toLocaleLowerCase()) {
        return true;
      }
    }
    return false;
  }

  verifyEmailAddressOTPCode() {

  }

  verifyPhoneNumberOTPCode() {
    this.feedbackProvider.presentLoading();
    this.windowRef.confirmationResult.confirm(this.data.otpCode).then(u => {
      this.getDatabaseUserAndNavigateToSetup(u.user);
    }).catch(() => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('OTP code error', 'The OTP code entered does not match the one sent to you by sms');
      // console.log(error, "Incorrect code entered?");
    });
  }

  getDatabaseUserAndNavigateToSetup(user: firebase.User) {
    const data = {
      firstname: this.data.firstname,
      lastname: this.data.lastname,
      phonenumber: this.data.phonenumber,
      email: this.data.email,
      uid: user.uid
    }
    this.feedbackProvider.presentModal(SetupPage, { data, type: 'email' });
  }

  navigate(user) {
    this.ionEvents.publish(EVENTS.loggedIn, user);
    this.authProvider.storeUser(user);
    if (user.type.toLowerCase() === USER_TYPE.client) {
      this.authProvider.storeUser(user);
      this.navCtrl.setRoot(DashboardPage);
    } else if (user.type.toLowerCase() === USER_TYPE.provider) {
      this.authProvider.storeUser(user);
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  cancelOtpVerification() {
    this.showOTPPage = false;
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

  goToLogin() {
    this.navCtrl.setRoot(MultiLoginPage);
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
