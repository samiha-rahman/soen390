import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTempPageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { FloorPlanComponent } from 'src/app/components/floor-plan/floor-plan.component';
import { MapBoxComponent } from 'src/app/components/map-box/map-box.component';
import { MapDirective } from 'src/app/directives/map.directive';
import { OutdoorMapComponent } from 'src/app/components/outdoor-map/outdoor-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomeTempPageRoutingModule
  ],
  declarations: [
    HomePage,
    MapBoxComponent,
    MapDirective,
    FloorPlanComponent,
    OutdoorMapComponent
  ],
  entryComponents: [
    FloorPlanComponent,
    OutdoorMapComponent
  ]
})
export class HomeTempPageModule {}
