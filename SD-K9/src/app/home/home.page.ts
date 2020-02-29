import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { BusPage } from '../modals/bus/bus.page';
import { AppsettingsPage } from '../modals/appsettings/appsettings.page';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  MarkerIcon,
  Marker
} from "@ionic-native/google-maps";

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
  footerState: IonPullUpFooterState;

  constructor(private modalController: ModalController, public platform: Platform, public nav: NavController, private geolocation: Geolocation) {}
  async openModal(){
    const modal = await this.modalController.create({
      component: BusPage
    });
    return await modal.present();
  }

  async openModal1(){
    const modal = await this.modalController.create({
      component: AppsettingsPage
    });
    return await modal.present();
  }

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  // optional capture events
  footerExpanded() {
      console.log('Footer expanded!');
  }

  // optional capture events
  footerCollapsed() {
      console.log('Footer collapsed!');
  }

  // toggle footer states
  toggleFooter() {
      this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  ngAfterViewInit() {

		this.platform.ready().then( () => {

			this.loadMap();
		});
	}

  loadMap() {

	let map = GoogleMaps.create( 'map' );

	map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {

    this.geolocation.getCurrentPosition().then((resp) => {

        const defaultPos = {
          lat: 45.494568,
          lng: -73.5795662
        };

       let coordinates: LatLng = new LatLng( resp.coords.latitude, resp.coords.longitude );
       let position = {
         target: coordinates,
         zoom: 14
       };

       map.animateCamera( position );
       let customMapPin: MarkerIcon = {
          url: 'assets/images/map-pin.png',
          size: {
            width: 25,
            height: 44
          }
        };
       let markerOptions: MarkerOptions = {
         position: coordinates,
         icon: customMapPin,
         title: 'You are here'
       };
       const marker = map.addMarker( markerOptions )
       .then( ( marker: Marker ) => {
         marker.showInfoWindow();
       });
    }).catch((error) => {
      console.log('Error getting location', error);
    });

	})
}

}
