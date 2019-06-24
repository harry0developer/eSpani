import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { slideIn, listSlideUp } from '../../utils/animations';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { AppliedJob, Job, ViewedJob, SharedJob } from '../../models/job';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [slideIn, listSlideUp]
})

export class ProfilePage {
  profile: User;
  userRating: string;
  hired: boolean = false;
  appointments: Appointment[] = []
  postedJobs: Job[] = [];
  viewedJobs: Job[] = [];
  skills: any[] = [];
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider) { }


  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();

    // this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appointments, 'rid', this.profile.uid).subscribe(appointments => {
    //   this.appointments = appointments;
    // });

    // this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, 'uid', this.profile.uid).subscribe(raters => {
    //   this.userRating = this.dataProvider.getUserRating(raters);
    // });

    // if (this.isRecruiter(this.profile)) {
    //   this.dataProvider.getCollectionByKeyValuePair(COLLECTION.jobs, 'uid', this.profile.uid).subscribe(postedJobs => {
    //     this.postedJobs = postedJobs;
    //   });
    // } else {
    //   this.dataProvider.getAllFromCollection(COLLECTION.viewedJobs).subscribe(jobs => {
    //     this.viewedJobs = this.dataProvider.getMyServices(jobs, this.profile);
    //   });
    // }

  }


  profilePicture(user): string {
    return `assets/imgs/users/${user.gender}.svg`;
  }
}
