import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { RatingModule } from "ngx-rating";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrMaskerModule } from 'brmasker-ionic-3';
import { HttpClientModule } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig } from '../firebase-config';
import { SocialSharing } from '@ionic-native/social-sharing';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { AuthProvider } from '../providers/auth/auth';
import { ServicesPage } from '../pages/services/services';
import { ServiceDetailsPage } from '../pages/service-details/service-details';
import { ProfilePage } from '../pages/profile/profile';
import { MultiLoginPage } from '../pages/multi-login/multi-login';
import { MultiSignupPage } from '../pages/multi-signup/multi-signup';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { WindowProvider } from '../providers/window/window';
import { SetupPage } from '../pages/setup/setup';
import { FilterPage } from '../pages/filter/filter';
import { CategoryPage } from '../pages/category/category';
import { DashboardPage } from '../pages/dashboard/dashboard';

@NgModule({
  declarations: [
    MyApp,
    ServicesPage,
    ServiceDetailsPage,
    ProfilePage,
    MultiLoginPage,
    MultiSignupPage,
    SetupPage,
    ProfilePage,
    FilterPage,
    CategoryPage,
    DashboardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    BrMaskerModule,
    RatingModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ServicesPage,
    ServiceDetailsPage,
    ProfilePage,
    MultiLoginPage,
    MultiSignupPage,
    SetupPage,
    ProfilePage,
    FilterPage,
    CategoryPage,
    DashboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
    AuthProvider,
    FeedbackProvider,
    WindowProvider,
    AngularFirestore,
    AngularFireAuth,
    SocialSharing,
    AuthProvider,
    DataProvider,
    FeedbackProvider,
    WindowProvider,
  ]
})
export class AppModule { }
