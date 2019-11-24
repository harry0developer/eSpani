import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';

import { UsersPage } from '../pages/users/users';
import { ProfilePage } from '../pages/profile/profile';
import { User } from '../models/user';
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { ChatsPage } from '../pages/chats/chats';
import { COLLECTION } from '../utils/consts';
import { Requester } from '../models/requester';
import { Rating } from '../models/rating';
import { RatersPage } from '../pages/raters/raters';
import { DashboardPage } from '../pages/dashboard/dashboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: any;
  profile: User;
  requesters: Requester[] = [];
  raters: Rating[] = [];
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
  ) {
    this.initializeApp();
    this.pages = {
      usersPage: UsersPage,
      dashboardPage: DashboardPage,
      chatsPage: ChatsPage,
      ratersPage: RatersPage,
      profilePage: ProfilePage
    }

  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setProfile();
    });
  }

  setProfile() {
    if (this.authProvider.isLoggedIn()) {
      this.dataProvider.getUserById(this.authProvider.getStoredUserId()).subscribe(user => {
        this.profile = user;
      });
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component, { page: 'root' });
  }

  getProfilePic(user) {
    return `assets/imgs/users/${user.gender}.svg`;
  }

  logout() {
    this.authProvider.afAuth.auth.signOut().then(() => {
      this.authProvider.clearStoredUser();
      this.nav.setRoot(LoginPage);
    })
  }
}
