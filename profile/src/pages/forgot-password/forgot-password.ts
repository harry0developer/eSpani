import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { MultiLoginPage } from '../multi-login/multi-login';
import { User } from '../../models/user';
import { FIREBASE } from '../../utils/const';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  data = {
    email: ''
  }

  users: User;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider
  ) {
  }

  ionViewDidLoad() {

  }

  confirmEmailAndSentOtp() {
    console.log('confirmEmailAndSentOtp');
  }

  resetPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.forgotPassword(this.data.email).then(() => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentAlert("Email Send", "Got to your emails and follow the link to reset your password");
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code.toLowerCase() === FIREBASE.NOT_FOUND.toLowerCase()) {
        this.feedbackProvider.presentAlert("Email not registered", "The email address provided is not registered. Please signup");
      } else {
        this.feedbackProvider.presentAlert("Email not sent", "Oops, something went wrong, please try again");
      }
      console.log(err);
    })
  }

  goToLogin() {
    this.navCtrl.setRoot(MultiLoginPage);
  }
}
