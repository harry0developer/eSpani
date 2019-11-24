import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { UserDetailsPage } from '../user-details/user-details';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE } from '../../utils/consts';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: User[];
  profile: User;
  constructor(public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider) {
  }

  ionViewDidLoad() {
    if (this.authProvider.isLoggedIn()) {
      this.feedbackProvider.presentLoading();
      this.dataProvider.getUserById(this.authProvider.getStoredUserId()).subscribe(user => {
        this.profile = user;

        this.dataProvider.getAllFromCollection(COLLECTION.users).subscribe(users => {
          this.feedbackProvider.dismissLoading();
          if (this.profile.userType === USER_TYPE.buyer) {
            this.users = users.filter(user => user.userType === USER_TYPE.seller);
          } else {
            this.users = users.filter(user => user.userType === USER_TYPE.buyer);
          }
        }, err => {
          this.feedbackProvider.dismissLoading();
        });
      }, err => {
        this.feedbackProvider.dismissLoading();
      });
    }
  }

  viewUserProfile(user) {
    this.navCtrl.push(UserDetailsPage, { user, profile: this.profile });
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

}
