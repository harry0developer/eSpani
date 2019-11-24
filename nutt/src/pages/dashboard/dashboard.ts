import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { COLLECTION } from '../../utils/consts';
import { Rating } from '../../models/rating';
import { Requester } from '../../models/requester';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { ChatPage } from '../chat/chat';
import { RatersPage } from '../raters/raters';
import { ChatsPage } from '../chats/chats';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: User;
  rating: string;
  raters: Rating[] = [];
  requesters: Requester[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
  ) { }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getItemById(COLLECTION.users, this.authProvider.getStoredUserId()).subscribe(profile => {
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, this.dataProvider.getProfileKeyType(profile), profile.uid).subscribe(raters => {
        this.dataProvider.getCollectionByKeyValuePair(COLLECTION.requesters, this.dataProvider.getProfileKeyType(profile), profile.uid).subscribe(requesters => {
          this.rating = this.dataProvider.calculateRating(raters);
          this.profile = profile;
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
    this.navCtrl.push(ChatsPage, { page: 'chats', profile: this.profile, requesters: this.requesters });
  }

  viewRaters() {
    this.navCtrl.push(RatersPage, { page: 'raters', profile: this.profile, raters: this.raters });
  }

  openSettings() {
    console.log('open settings');
  }

  isSeller(): boolean {
    return this.dataProvider.isSeller(this.profile);
  }

}
