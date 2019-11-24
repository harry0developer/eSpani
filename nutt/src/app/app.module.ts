import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../config';

// 1. Import the libs you need
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';


import { AuthProvider } from '../providers/auth/auth';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { DataProvider } from '../providers/data/data';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { UsersPage } from '../pages/users/users';
import { UserDetailsPage } from '../pages/user-details/user-details';

import { RatingModule } from "ngx-rating";
import { ProfilePage } from '../pages/profile/profile';
import { ChatPage } from '../pages/chat/chat';
import { FirebaseDataProvider } from '../providers/firebase-data/firebase-data';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';
import { ChatsPage } from '../pages/chats/chats';
import { RatersPage } from '../pages/raters/raters';
import { BubblePrimaryComponent } from '../components/bubble-primary/bubble-primary';
import { BubbleSecondaryComponent } from '../components/bubble-secondary/bubble-secondary';
import { RateUserPage } from '../pages/rate-user/rate-user';
import { DashboardPage } from '../pages/dashboard/dashboard';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    UsersPage,
    UserDetailsPage,
    SignupPage,
    ForgotPasswordPage,
    ProfilePage,
    ChatsPage,
    RatersPage,
    RateUserPage,
    ChatPage,
    DashboardPage,
    BubblePrimaryComponent,
    BubbleSecondaryComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    UsersPage,
    UserDetailsPage,
    SignupPage,
    ForgotPasswordPage,
    ProfilePage,
    ChatsPage,
    RatersPage,
    RateUserPage,
    ChatPage,
    DashboardPage,
    BubblePrimaryComponent,
    BubbleSecondaryComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFirestore,
    AngularFireAuth,
    AuthProvider,
    FeedbackProvider,
    DataProvider,
    FirebaseDataProvider,
    FirebaseAuthProvider
  ]
})
export class AppModule { }
