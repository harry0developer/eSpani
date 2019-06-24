import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { AppliedJob, SharedJob, ViewedJob } from '../../models/job';
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Service } from '../../models/services';

@IonicPage()
@Component({
  selector: 'page-service-details',
  templateUrl: 'service-details.html',
})
export class ServiceDetailsPage {
  service: Service;
  profile: any;

  hasApplied: boolean = false;

  appliedUsers: AppliedJob[] = [];
  viewedUsers: ViewedJob[] = [];
  sharedUsers: SharedJob[] = [];

  myRating: string;

  categories: any;

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public dataProvider: DataProvider, public navParams: NavParams,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private socialSharing: SocialSharing,
  ) { }

  ionViewDidLoad() {
    // this.feedbackProvider.presentLoading();
    // this.profile = this.authProvider.getStoredUser();
    this.service = this.navParams.get('service');
    this.categories = this.navParams.get('categories');
    this.getServicePoster();
    // let foundService = null;
    // this.dataProvider.getAllFromCollection(COLLECTION.viewedJobs).subscribe(viewedJobs => {
    //   const jobs = this.dataProvider.getArrayFromObjectList(viewedJobs);

    //   jobs.map(j => {
    //     if (j.id === this.service.jid) {
    //       foundService = j;
    //     }
    //   });

    //   if (!foundService) {
    //     const newJob: any = {
    //       uid: this.profile.uid,
    //       rid: this.service.uid,
    //       jid: this.service.jid,
    //       date: this.dataProvider.getDateTime()
    //     }
    //     console.log(newJob);
    //     this.dataProvider.addUserActionToJobCollection(COLLECTION.viewedJobs, newJob);
    //   }
    //   this.feedbackProvider.dismissLoading();
    // }, err => {
    //   this.feedbackProvider.dismissLoading();
    // });


    // this.dataProvider.getDocumentFromCollection(COLLECTION.appliedJobs, this.service.jid).subscribe(appliedJobs => {
    //   this.appliedUsers = this.dataProvider.getArrayFromObjectList(appliedJobs.data());
    // });
    // this.dataProvider.getDocumentFromCollection(COLLECTION.viewedJobs, this.service.jid).subscribe(viewedJobs => {
    //   this.viewedUsers = this.dataProvider.getArrayFromObjectList(viewedJobs.data());
    // });
    // this.dataProvider.getDocumentFromCollection(COLLECTION.sharedJobs, this.service.jid).subscribe(sharedJobs => {
    //   this.sharedUsers = this.dataProvider.getArrayFromObjectList(sharedJobs.data());
    // });
  }

  getServicePoster() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getItemById(COLLECTION.users, this.service.uid).subscribe(v => {
      this.service.postedBy = v;
      console.log(v);

      this.feedbackProvider.dismissLoading();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  hasViewedJob(): boolean {
    let hasSeen = false;
    this.viewedUsers.forEach(viewedJob => {
      if (viewedJob.jid === this.service.id && viewedJob.uid === this.profile.uid) {
        hasSeen = true;
      }
    });
    return hasSeen;
  }

  addToViewedJobs() {
    const viewedJob: ViewedJob = {
      uid: this.profile.uid,
      jid: this.service.id,
      rid: this.service.uid,
      date: this.dataProvider.getDateTime()
    }
    this.dataProvider.addNewItem(COLLECTION.viewedJobs, viewedJob).then(() => {
      console.log('Added to views');
    }).catch(err => {
      console.log('Not added to views');
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

  requestService() {

  }

  // applyNow(job) {
  //   this.feedbackProvider.presentLoading();
  //   const appliedJob: AppliedJob = {
  //     uid: this.profile.uid,
  //     jid: job.id,
  //     rid: job.postedBy.uid,
  //     date: this.dataProvider.getDateTime()
  //   }
  //   this.dataProvider.addNewItem(COLLECTION.appliedJobs, appliedJob).then(() => {
  //     this.hasApplied = true;
  //     this.feedbackProvider.dismissLoading();
  //     this.feedbackProvider.presentToast('You have successfully applied');
  //   }).catch(err => {
  //     console.log(err);
  //     this.feedbackProvider.dismissLoading();
  //     this.feedbackProvider.presentErrorAlert('Job application', 'Error while applying for a job');
  //   });
  // }

  // withdrawApplication(job) {
  //   this.feedbackProvider.presentLoading();
  //   this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appliedJobs, 'jid', job.id).subscribe(doc => {
  //     const deleteJob = doc.filter(dJob => dJob.jid === job.id);
  //     if (deleteJob[0]) {
  //       this.dataProvider.removeItem(COLLECTION.appliedJobs, deleteJob[0].id).then(() => {
  //         this.hasApplied = false;
  //         this.feedbackProvider.dismissLoading();
  //         this.feedbackProvider.presentToast('Job application cancelled successfully');
  //       }).catch(err => {
  //         console.log(err);
  //         this.feedbackProvider.dismissLoading();
  //         this.feedbackProvider.presentErrorAlert('Cancel Application', 'An error occured while cancelling job application');
  //       });
  //     }

  //   });
  // }

  getDateFromNow(date: string) {
    return this.dataProvider.getDateTimeMoment(date);
  }

  getUsersViewed() {
    let users = 0;
    this.viewedUsers.forEach(vjob => {
      if (vjob.jid === this.service.id) {
        users++;
      }
    });
    return users;
  }
  getUsersApplied() {
    let users = 0;
    this.appliedUsers.forEach(ajob => {
      if (ajob.jid === this.service.id) {
        users++;
      }
    });
    return users;
  }
  getUsersShared() {
    let users = 0;
    this.sharedUsers.forEach(sjob => {
      if (sjob.jid === this.service.id) {
        users++;
      }
    });
    return users;
  }

  hasUserApplied() {
    // let applied = false;
    // this.appliedUsers.forEach(appliedJob => {
    //   if (appliedJob.uid === this.profile.uid && appliedJob.uid === this.profile.uid && this.profile.uid === appliedJob.uid && this.service.jid === appliedJob.jid) {
    //     applied = true;
    //   }
    // });
    // return applied;
  }

  isJobViewed(): boolean {
    if (this.viewedUsers && this.viewedUsers.length > 0) {
      const v = this.viewedUsers.filter(viewed => viewed.uid === this.profile.uid && viewed.jid === this.service.id);
      return v.length > 0;
    } else {
      return false;
    }
  }

  // confirmCancelApplication(job) {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'You are about to cancel job application',
  //     buttons: [
  //       {
  //         text: 'Cancel Application',
  //         role: 'destructive',
  //         handler: () => {
  //           this.withdrawApplication(job);
  //         }
  //       },
  //       {
  //         text: "Don't Cancel",
  //         role: 'cancel',
  //         handler: () => {
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }


  viewAppliedUsers() {
    // this.navCtrl.push(ViewUsersPage, { category: 'applied', users: this.appliedUsers });
  }
  viewViewedUsers() {
    // this.navCtrl.push(ViewUsersPage, { category: 'viewed', users: this.viewedUsers });
  }
  viewSharedUsers() {
    // this.navCtrl.push(ViewUsersPage, { category: 'shared', users: this.sharedUsers });
  }

  getSkills(skills) {
    return []; //  skills.split(',');
  }

  countAppliedUsers() {

  }

  addToViewedHelper() {

  }


  editJob(job) {
    // this.navCtrl.push(PostJobPage, { job: job, action: 'edit' });
  }

  shareJobWithFacebook(job) {
    let shared: boolean = false;
    this.socialSharing.shareViaFacebook(job).then(res => {
      console.log('Sharing success :)');

    }).catch(err => {
      console.log('Error shareJobWithFacebook');
    });
    return shared;
  }

  shareJobWithTwitter(job) {
    let shared: boolean = false;
    this.socialSharing.shareViaTwitter(job).then(res => {
      console.log('Sharing success :)');

    }).catch(err => {
      console.log('Error shareJobWithTwitter');
    });
    return shared;
  }

  shareJobWithInstagram(job) {
    let shared: boolean = false;
    this.socialSharing.shareViaInstagram(job, 'img.png').then(res => {
      console.log('Sharing success :)');
    }).catch(err => {
      console.log('Error shareJobWithInstagram');
    });
    return shared;
  }


  addToShareduserssharedUsers(job, platform) {
    // this.feedbackProvider.presentLoading();
    // const sharedJob: SharedJob = {
    //   jid: job.jid,
    //   uid: this.profile.uid,
    //   rid: this.service.postedBy.uid,
    //   dateShared: this.dataProvider.getDateTime(),
    //   platform,
    // }
    // this.dataProvider.addNewItem(COLLECTION.sharedJobs, sharedJob).then(() => {
    //   this.feedbackProvider.dismissLoading();
    //   this.feedbackProvider.presentToast('Job shared successfully');
    // }).catch(err => {
    //   console.log(err);
    //   this.feedbackProvider.dismissLoading();
    //   this.feedbackProvider.presentErrorAlert('Job share', 'An error occured while sharing a job');
    // });

  }

  deleteJob(job) {

  }

  manageJob(job) {
    const actionSheet = this.actionSheetCtrl.create({
      title: `Manage: ${job.title}`,
      buttons: [
        {
          text: 'Edit Job',
          icon: 'create',
          handler: () => {
            this.editJob(job);
          }
        },
        {
          text: 'Delete Job',
          icon: 'trash',
          handler: () => {
            this.deleteJob(job);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentShareJobActionSheet(job) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share this job',
      buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            console.log('job shared...');

            //this.events.publish(EVENTS.facebookShare);
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            console.log('job shared...');

            //this.events.publish(EVENTS.twitterShare);
          }
        },
        {
          text: 'Instagram',
          icon: 'logo-instagram',
          handler: () => {
            console.log('job shared...');

            //this.events.publish(EVENTS.instagramShare);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

}
