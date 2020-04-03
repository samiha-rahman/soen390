import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTempPageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { FloorPlanComponent } from 'src/app/components/floor-plan/floor-plan.component';
import { MapBoxComponent } from 'src/app/components/map-box/map-box.component';
import { MapDirective } from 'src/app/directives/map.directive';
import { OutdoorMapComponent } from 'src/app/components/outdoor-map/outdoor-map.component';
import { TopDirectionsBarComponent } from 'src/app/components/top-directions-bar/top-directions-bar.component';
import { BuildingInfoComponent } from 'src/app/components/building-info/building-info.component';
import { IndoorFloorSelectorComponent } from 'src/app/components/indoor-floor-selector/indoor-floor-selector.component';
import { PullupComponent } from 'src/app/components/pullup/pullup.component';
import { IonicPullupModule } from 'ionic-pullup';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomeTempPageRoutingModule,
    IonicPullupModule
  ],
  declarations: [
    HomePage,
    MapBoxComponent,
    MapDirective,
    FloorPlanComponent,
    OutdoorMapComponent,
    TopDirectionsBarComponent,
    BuildingInfoComponent,
    IndoorFloorSelectorComponent,
    PullupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    FloorPlanComponent,
    OutdoorMapComponent
  ]
})
export class HomeTempPageModule { }
