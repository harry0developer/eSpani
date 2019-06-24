import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Filter } from '../../models/filter';
import { FILTER } from '../../utils/const';
import { Service } from '../../models/services';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  categories: any = [];
  tmpCategories: any = [];
  filter: Filter = {
    category: FILTER.all,
    distance: FILTER.max_distance
  };
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public feedbackProvider: FeedbackProvider,
    public viewCtrl: ViewController,
  ) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.categories = this.navParams.get('categories');
    this.tmpCategories = this.categories;
    this.setFilteredItems('');
    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }

  getServiceIcon(service: Service): string {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].category.toLocaleLowerCase() === service.category.toLocaleLowerCase()) {
        return this.categories[i].icon;
      }
    }
    return "default";
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems(searchTerm) {
    this.categories = this.filterItems(searchTerm);
  }

  filterItems(searchTerm) {
    return this.tmpCategories.filter(item => {
      return item.category.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  selectCategory(category) {
    this.viewCtrl.dismiss(category.category);
  }


  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
