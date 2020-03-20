import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicPullupModule } from 'ionic-pullup';

import { HomePage } from './home.page';
import { BusPage } from 'src/app/components/bus/bus.page';
import { AppSettings } from 'src/app/pages/app-settings/app-settings.page';
import { FloorPlanComponent } from '../../components/floor-plan/floor-plan.component';

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
  declarations: [HomePage, BusPage, AppSettings, FloorPlanComponent],
  entryComponents: [BusPage, AppSettings]
})
export class HomePageModule { }
