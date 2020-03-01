import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OutdoorPageRoutingModule } from './outdoor-routing.module';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { OutdoorPage } from './outdoor.page';
import { BusPage } from 'src/app/modals/bus/bus.page';
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
