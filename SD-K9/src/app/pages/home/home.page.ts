import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { Location } from '../../helpers/location';
import { ModalController } from '@ionic/angular';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { IonPullUpFooterState } from 'ionic-pullup';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SVGCoordinate } from 'src/app/interfaces/svg-coordinate.model';

declare var google;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  showFloorPlan = true;

  start = 'H-831';
  end = 'H-815';

  floor = 8;
  building = 'hall';

  private _initLocation: Location;
  private _destination: Location;
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  userMarker: any;
  mapInitialised: boolean = false;
  currentPos: any;
  apiKey: string = "AIzaSyA_u2fkanThpKMP4XxqLVfT9uK0puEfRns";

  constructor(
    private _mapCoordinator: MapCoordinator,
    private modalController: ModalController,
    private geolocation: Geolocation
    ) {
      this.loadGMaps();
    }

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  toSVGCoordinate(id: string, building: string, floor: number): SVGCoordinate {
    return {
      id,
      x: parseInt(document.getElementById(id)["cx"].baseVal.value),
      y: parseInt(document.getElementById(id)["cy"].baseVal.value),
      building,
      floor
    };
  }

  // TODO: Base on user input, determine if we must use SVGCoordinate or GoogleCoordinate for Location.Coordinate
  getRouteTest() {
    this._initLocation.setCoordinate(this.toSVGCoordinate(this.start, this.building, this.floor));
    this._destination.setCoordinate(this.toSVGCoordinate(this.end, this.building, this.floor));
    this._mapCoordinator.getRoute(this._initLocation, this._destination);
  }

  footerState: IonPullUpFooterState;

  async openModal() {
    const modal = await this.modalController.create({
      component: BusPage
    });
    return await modal.present();
  }

  async openModal1() {
    const modal = await this.modalController.create({
      component: AppsettingsPage
    });
    return await modal.present();
  }

  //optional capture events
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

  loadGMaps() {
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      console.log("Google maps JavaScript needs to be loaded.");
      //Load the SDK
      window['initMap'] = () => {
        this.initMap();
      }
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=initMap';
      document.body.appendChild(script);
    }else{
      this.initMap();
    }
  }

  initMap() {

    this.mapInitialised = true;

    this.geolocation.getCurrentPosition().then((position) => {

      this.currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.currentPos,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var markerIcon = {
        url: 'assets/images/map-pin.png',
        scaledSize: new google.maps.Size(25, 44),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(12, 44)
      };

      this.userMarker = new google.maps.Marker({
        position: this.currentPos,
        map: this.map,
        title: 'You are here',
        icon: markerIcon
      });

      this.drawBuildings();

      this.maintainMap();

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  maintainMap(){
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.currentPos = new google.maps.LatLng( data.coords.latitude, data.coords.longitude );
        this.userMarker.setPosition( this.currentPos );
      });
  }

  drawBuildings(){
    // TODO : draw all buildings
    let EV_BOUNDS = [
        {"lat": 45.495176, "lng": -73.577883},
        {"lat": 45.495815, "lng": -73.577223},
        {"lat": 45.496030, "lng": -73.577695},
        {"lat": 45.495755, "lng": -73.578012},
        {"lat": 45.496116, "lng": -73.578800},
        {"lat": 45.495778, "lng": -73.579101}
      ];
    let evOverlay = new google.maps.Polygon({
        paths: EV_BOUNDS,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
    evOverlay.setMap(this.map);
  }

  toggleCampus(event){
    if(event.detail.value == "sgw"){
      this.map.panTo(new google.maps.LatLng(45.4967982,-73.5805984));
    }else if(event.detail.value == "lyl"){
      this.map.panTo(new google.maps.LatLng(45.458246,-73.6426491));
    }
  }

  locateUser(){
    this.map.panTo(this.currentPos);
  }

}
