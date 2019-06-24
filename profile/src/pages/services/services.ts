import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION, STORAGE_KEY, FILTER } from '../../utils/const';
import { FilterPage } from '../filter/filter';
import { Filter } from '../../models/filter';
import { Service } from '../../models/services';
import { ServiceDetailsPage } from '../service-details/service-details';

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
  animations: [bounceIn]

})
export class ServicesPage {

  profile: User;
  services: Service[] = [];
  categories: any;
  tmpServices: Service[] = [];
  loading: boolean;
  filter: Filter = {
    category: FILTER.all,
    distance: FILTER.max_distance
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    this.loading = true;
    this.profile = this.authProvider.getStoredUser();

    this.dataProvider.getServices().then(res => {
      this.categories = res;
    }).catch(err => {
      console.log(err);
    });

    const filter = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.filter);
    this.filter.category = filter && filter.category ? filter.category : FILTER.all;
    this.filter.distance = filter && filter.distance > 0 ? filter.distance : FILTER.max_distance;
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.getAllFromCollection(COLLECTION.services).subscribe(services => {
      const loc = {
        lat: -26.121747,
        lng: 28.173450
      }
      this.services = this.dataProvider.applyHaversine(services, loc.lat, loc.lng);
      this.tmpServices = this.services;
      this.applyJobFilter(this.filter);
      this.loading = false;
      this.feedbackProvider.dismissLoading();
    }, err => {
      this.loading = false;
      this.feedbackProvider.dismissLoading();
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

  addService() {
    const service = {
      title: "Event planning and management",
      category: "Event Management",
      description: "We plan events for all types of ceremonies, funerals, parties, graduations at reasonable rate",
      services: ["Event planning", "Event management", "Decorations", "Theming"],
      date: this.dataProvider.getDateTime(),
      location: {
        address: "123 Small street, Johannesburg, 10001",
        geo: {
          lat: 19.12321,
          lng: -24.0213
        }
      },
      contact: {
        firstname: "Palesa",
        lastname: "Moshumi",
        email: "palesa@moshumi.com",
        phone: "0821101909"
      }
    };
    this.dataProvider.addNewItem(COLLECTION.services, service).then(res => {
      console.log('Service added');

    }).catch(err => {
      console.log(err);

    })
  }


  getMaxDistance(): number {
    return FILTER.max_distance;
  }

  getDateFromNow(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }

  viewServiceDetails(service: Service) {
    this.navCtrl.push(ServiceDetailsPage, { service: service, page: 'services', categories: this.categories });
  }

  filterJobs() {
    let modal = this.modalCtrl.create(FilterPage, { filter: this.filter, categories: this.categories });
    modal.onDidDismiss(filter => {
      if (filter) {
        this.filter = filter;
        this.applyJobFilter(filter);
      }
    });
    modal.present();
  }

  applyJobFilter(filter: Filter) {
    this.services = this.tmpServices;
    console.log(this.services);
    console.log(filter);

    if (filter.distance && filter.distance > 0) {
      this.services = this.services.filter(j => parseInt(j.distance) <= filter.distance);
    }
    if (filter.category && filter.category && filter.category !== FILTER.all) {
      this.services = this.services.filter(j => j.category.toLocaleLowerCase() === filter.category.toLocaleLowerCase());
    }

    if (filter.distance === FILTER.max_distance && filter.category.toLocaleLowerCase() === FILTER.all) { //reset filter
      this.services = this.tmpServices;
    }
  }

  doRefresh(refresher) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
      const loc = {
        lat: -26.121747,
        lng: 28.173450
      }
      this.services = this.dataProvider.applyHaversine(jobs, loc.lat, loc.lng);
      this.tmpServices = this.services;
      this.applyJobFilter(this.filter);
      this.feedbackProvider.dismissLoading();
      refresher.complete();
    }, err => {
      this.feedbackProvider.dismissLoading();
      refresher.complete();
    });
  }

}
