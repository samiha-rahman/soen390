import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';

import { DemoIndoorNavPageRoutingModule } from './demo-indoor-nav-routing.module';

import { DemoIndoorNavPage } from './demo-indoor-nav.page';
import { FloorPlanComponent } from '../../components/floor-plan/floor-plan.component';
import {BusPage} from '../../components/bus/bus.page';
import {AppSettings} from '../app-settings/app-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    DemoIndoorNavPageRoutingModule
  ],
  declarations: [DemoIndoorNavPage, BusPage, AppSettings, FloorPlanComponent],
  entryComponents: [BusPage, AppSettings]
})
export class DemoIndoorNavPageModule {}
