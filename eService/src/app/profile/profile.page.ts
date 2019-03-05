import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from 'src/models/job';
import { DataService } from 'src/services/data/data.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  jobs: any;
  constructor(
    public afStore: AngularFirestore,
    public authService: AuthService,
    public router: Router,
    public dataService: DataService,
    public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(state => {
      console.log(state);
      if (state && state.uid) {
        this.user = {
          uid: state.uid,
          email: state.email
        };

        this.setJobs(state.uid);
        this.setUser(state.uid);

      } else {
        this.logout();
      }
    });
  }

  setUser(uid: string) {
    this.dataService.getItemById(this.dataService.USERS_COLLECTION, uid).subscribe(user => {
      this.user = user;
    });
  }

  setJobs(uid: string) {
    this.jobs = this.dataService.getCollection(this.dataService.JOBS_COLLECTION, uid);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/home');
    });
  }

  addJob(uid) {
    const data: Job = {
      title: 'Home Cleaner',
      description: 'We are looking for someone who can clean',
      uid: this.afAuth.auth.currentUser.uid
    };
    this.dataService.addItem(this.dataService.JOBS_COLLECTION, data, uid).then(() => {
      console.log('Job added successfully');
    }).catch(err => {
      console.log(err);
    });
  }

  updateJob(jid) {
    console.log(jid);

    const data: Job = {
      title: 'Good Cleaner',
      description: 'We need a cleaner who can cook',
      uid: this.user.uid
    };
    this.dataService.updateItem(this.dataService.JOBS_COLLECTION, data, jid).then(() => {
      console.log('Job updated successfully');
    }).catch(err => {
      console.log(err);
    });
  }

}
