import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';

import { DemoIndoorNavPageRoutingModule } from './demo-indoor-nav-routing.module';

import { DemoIndoorNavPage } from './demo-indoor-nav.page';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';
import { BusPage } from '../../modals/bus/bus.page';
import { AppsettingsPage } from '../../modals/appsettings/appsettings.page';
import { TopDirectionsBarComponent } from 'src/app/top-directions-bar/top-directions-bar.component';
import { IndoorFloorSelectorComponent } from 'src/app/indoor-floor-selector/indoor-floor-selector.component';
import { RoutePullupFooterComponent } from 'src/app/route-pullup-footer/route-pullup-footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    DemoIndoorNavPageRoutingModule
  ],
  declarations: [
    DemoIndoorNavPage,
    BusPage,
    AppsettingsPage,
    FloorPlanComponent,
    TopDirectionsBarComponent,
    IndoorFloorSelectorComponent,
    RoutePullupFooterComponent
  ],
  entryComponents: [BusPage, AppsettingsPage]
})
export class DemoIndoorNavPageModule { }
