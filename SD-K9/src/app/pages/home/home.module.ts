import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicPullupModule } from 'ionic-pullup';

import { HomePage } from './home.page';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';

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
  declarations: [HomePage, BusPage, AppsettingsPage, FloorPlanComponent],
  entryComponents: [BusPage, AppsettingsPage]
})
export class HomePageModule { }
