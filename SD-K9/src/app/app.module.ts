import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MapDirector } from './providers/map-director.service';
import { Location } from './providers/location.service';
import { IndoorMapBuilder } from './providers/indoor-map-builder.service';
import { OutdoorMapBuilder } from './providers/outdoor-map-builder.service';

import { IndoorMapData } from './data-models/indoor-map-data';
import { OutdoorMapData } from './data-models/outdoor-map-data';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConcordiaCampus } from './data-models/concordia-campus-data';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    MapDirector,
    IndoorMapBuilder,
    OutdoorMapBuilder,
    Location,
    IndoorMapData,
    OutdoorMapData,
    ConcordiaCampus,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
