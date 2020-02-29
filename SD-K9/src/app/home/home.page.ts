import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { BusPage } from '../modals/bus/bus.page';
import { AppsettingsPage } from '../modals/appsettings/appsettings.page';
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

    let map =

	// let map = GoogleMaps.create( 'map' );
  //
	// map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
  //
  //   const defaultPos = {
  //     target : {
  //       lat: 45.494568,
  //       lng: -73.5795662
  //     },
  //     zoom: 9
  //   };
  //
  //   map.moveCamera(defaultPos);
  //
  //   let EV_BOUNDS: ILatLng[] = [
  //       {"lat": 45.495176, "lng": -73.577883},
  //       {"lat": 45.495815, "lng": -73.577223},
  //       {"lat": 45.496030, "lng": -73.577695},
  //       {"lat": 45.495755, "lng": -73.578012},
  //       {"lat": 45.496116, "lng": -73.578800},
  //       {"lat": 45.495778, "lng": -73.579101}
  //     ];
  //
  //   let options: PolygonOptions = {
  //     'points': EV_BOUNDS,
  //     'strokeColor' : '#AA00FF',
  //     'fillColor' : '#00FFAA',
  //     'strokeWidth': 10
  //   };
  //
  //   map.addPolygon(options).then((polygon: Polygon) => {
  //
  //   });
  //
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //      let coordinates: LatLng = new LatLng( resp.coords.latitude, resp.coords.longitude );
  //      let position = {
  //        target: coordinates,
  //        zoom: 14
  //      };
  //
  //      map.animateCamera( position );
  //      let customMapPin: MarkerIcon = {
  //         url: 'assets/images/map-pin.png',
  //         size: {
  //           width: 25,
  //           height: 44
  //         }
  //       };
  //      let markerOptions: MarkerOptions = {
  //        position: coordinates,
  //        icon: customMapPin,
  //        title: 'You are here'
  //      };
  //      const marker = map.addMarker( markerOptions )
  //      .then( ( marker: Marker ) => {
  //        marker.showInfoWindow();
  //      });
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  //
  //   let watch = this.geolocation.watchPosition();
  //   watch.subscribe((data) => {
  //    const currentPos = {
  //      target : {
  //        lat: data.coords.latitude,
  //        lng: data.coords.longitude
  //      }
  //    };
  //    map.animateCamera(currentPos);
  //   });
  //
	// })
}

}
