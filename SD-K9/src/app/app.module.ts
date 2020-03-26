import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IndoorRouteBuilder } from './providers/indoor-route-builder.service';
import { OutdoorRouteBuilder } from './providers/outdoor-route-builder.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Pathfinder } from './providers/pathfinder.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicPullupModule } from 'ionic-pullup';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicPullupModule,
    HttpClientModule,
    BrowserAnimationsModule],
  providers: [
    IndoorRouteBuilder,
    OutdoorRouteBuilder,
    StatusBar,
    SplashScreen,
    Geolocation,
    Pathfinder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
