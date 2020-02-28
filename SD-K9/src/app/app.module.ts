import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IndoorRouteBuilder } from './providers/indoor-route-builder.service';
import { OutdoorRouteBuilder } from './providers/outdoor-route-builder.service';
import { IndoorMapBuilder } from './providers/indoor-map-builder.service';
import { OutdoorMapBuilder } from './providers/outdoor-map-builder.service';

import { IndoorMapData } from './data-models/indoor-map-data';
import { OutdoorMapData } from './data-models/outdoor-map-data';
import { HallBuildingData } from './data-models/hall-building-data';
import { LoyolaCampusData } from './data-models/loyola-campus-data';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicPullupModule } from 'ionic-pullup';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicPullupModule],
  providers: [
    IndoorRouteBuilder,
    OutdoorRouteBuilder,
    IndoorMapBuilder,
    OutdoorMapBuilder,
    IndoorMapData,
    OutdoorMapData,
    HallBuildingData,
    LoyolaCampusData,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]

})
export class AppModule {}

