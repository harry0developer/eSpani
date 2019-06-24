import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { CategoryPage } from '../category/category';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, FILTER } from '../../utils/const';
import { Filter } from '../../models/filter';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  filter: Filter = {
    category: FILTER.all,
    distance: FILTER.max_distance
  };
  categories: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.filter = this.navParams.get(STORAGE_KEY.filter);
    this.categories = this.navParams.get('categories');
  }

  getMaxDistance(): number {
    return FILTER.max_distance;
  }

  getCategories() {
    let modal = this.modalCtrl.create(CategoryPage, { filter: this.filter, categories: this.categories });
    modal.onDidDismiss(category => {
      if (category) {
        this.filter.category = category;
      }
    });
    modal.present();
  }

  dismissModal() {
    this.viewCtrl.dismiss(null);
  }

  applyFilter() {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.filter, this.filter);
    this.viewCtrl.dismiss(this.filter);
  }

  clearFilter() {
    this.filter.category = FILTER.all,
      this.filter.distance = FILTER.max_distance
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.filter, this.filter);
    this.viewCtrl.dismiss(this.filter);
  }
}
