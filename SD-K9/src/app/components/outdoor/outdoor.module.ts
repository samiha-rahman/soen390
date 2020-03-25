import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OutdoorPageRoutingModule } from './outdoor-routing.module';
import { AppSettings } from 'src/app/pages/app-settings/app-settings.page';
import { OutdoorPage } from './outdoor.page';
import { BusPage } from 'src/app/components/bus/bus.page';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { IonicPullupModule } from 'ionic-pullup';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    OutdoorPageRoutingModule
  ],
  declarations: [OutdoorPage],
})
export class OutdoorPageModule {}
