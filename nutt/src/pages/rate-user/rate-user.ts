import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { Rating } from '../../models/rating';

@IonicPage()
@Component({
  selector: 'page-rate-user',
  templateUrl: 'rate-user.html',
})
export class RateUserPage {
  user: User;
  rating: string = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCntrl: ViewController,
    public dataProvider: DataProvider,
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');

  }

  rateUser() {
    this.dataProvider.openModal = false;
    const ratingData = {
      user: this.user,
      rating: this.rating,
    }
    this.viewCntrl.dismiss(ratingData);
  }

  dismiss() {
    this.dataProvider.openModal = false;
    this.viewCntrl.dismiss();
  }

}
