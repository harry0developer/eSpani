import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../models/user';
import { COLLECTION, USER_TYPE } from '../../utils/consts';
import { AuthProvider } from '../../providers/auth/auth';
import { Rating } from 'ngx-rating';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { ChatsPage } from '../chats/chats';
import { RatersPage } from '../raters/raters';
import { Requester } from '../../models/requester';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  img: string;
  profile: User;
  rating: string;
  raters: Rating[] = [];
  requesters: Requester[] = [];
  constructor(public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
  ) {
  }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getItemById(COLLECTION.users, this.authProvider.getStoredUserId()).subscribe(profile => {
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, this.dataProvider.getProfileKeyType(profile), profile.uid).subscribe(raters => {
        this.dataProvider.getCollectionByKeyValuePair(COLLECTION.requesters, this.dataProvider.getProfileKeyType(profile), profile.uid).subscribe(requesters => {
          this.rating = this.dataProvider.calculateRating(raters);
          this.profile = profile;
          this.img = this.profile.avatar;
          this.feedbackProvider.dismissLoading();
          this.raters = raters;
          this.requesters = requesters;
        }, err => {
          this.feedbackProvider.dismissLoading();
        });
      }, err => {
        this.feedbackProvider.dismissLoading();
      });
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  getDistance(geo) {
    return this.dataProvider.getLocationFromGeo(geo);
  }

  viewChats() {
    this.navCtrl.push(ChatsPage, { page: 'chats', requesters: this.requesters });
  }

  viewRaters() {
    this.navCtrl.push(RatersPage, { page: 'raters', raters: this.raters });
  }

  openSettings() {
    console.log('open settings');
  }

  isSeller(): boolean {
    return this.dataProvider.isSeller(this.profile);
  }
}
