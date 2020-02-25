import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicPullupModule } from 'ionic-pullup';

import { HomePage } from './home.page';
import { BusPage } from '../modals/bus/bus.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, BusPage],
  entryComponents: [BusPage]
})
export class HomePageModule {}
