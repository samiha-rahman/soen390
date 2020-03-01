import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TempIndoorPagePageRoutingModule } from './temp-indoor-page-routing.module';

import { TempIndoorPagePage } from './temp-indoor-page.page';
import { FloorPlanComponent } from '../pages/floor-plan/floor-plan.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TempIndoorPagePageRoutingModule
  ],
  declarations: [TempIndoorPagePage, FloorPlanComponent]
})
export class TempIndoorPagePageModule { }
