import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicPullupModule } from 'ionic-pullup';
import { IonicModule } from '@ionic/angular';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';

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
    HomeTempPageRoutingModule,
    IonicPullupModule
  ],
  declarations: [
    HomePage,
    MapBoxComponent,
    MapDirective,
    FloorPlanComponent,
    OutdoorMapComponent,
    BusPage,
    AppsettingsPage
  ],
  entryComponents: [
    FloorPlanComponent,
    OutdoorMapComponent,
    BusPage,
    AppsettingsPage
  ]
})
export class HomeTempPageModule {}
