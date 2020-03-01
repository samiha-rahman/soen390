import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';

import { DemoIndoorNavPageRoutingModule } from './demo-indoor-nav-routing.module';

import { DemoIndoorNavPage } from './demo-indoor-nav.page';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';
import {BusPage} from '../../modals/bus/bus.page';
import {AppsettingsPage} from '../../modals/appsettings/appsettings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    DemoIndoorNavPageRoutingModule
  ],
  declarations: [DemoIndoorNavPage, BusPage, AppsettingsPage, FloorPlanComponent],
  entryComponents: [BusPage, AppsettingsPage]
})
export class DemoIndoorNavPageModule {}
