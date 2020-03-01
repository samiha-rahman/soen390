import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutdoorPageRoutingModule } from './outdoor-routing.module';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { OutdoorPage } from './outdoor.page';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { IonicPullupModule } from 'ionic-pullup';

const routes: Routes = [
  {
    path: '',
    component: OutdoorPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path:'',
        component: OutdoorPage
      }]),
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    OutdoorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OutdoorPage],
})
export class OutdoorPageModule {}
