import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultiSignupPage } from './multi-signup';

@NgModule({
  declarations: [
    MultiSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(MultiSignupPage),
  ],
})
export class MultiSignupPageModule {}
