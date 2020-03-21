import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map } from '../../interfaces/map';
import { GoogleCoordinate } from '../../models/google-coordinate.model';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';

declare var google;

@Component({
  selector: 'app-outdoor-map',
  templateUrl: './outdoor-map.component.html',
  styleUrls: ['./outdoor-map.component.scss'],
})
export class OutdoorMapComponent implements OnInit, OnDestroy, Map {
  @Input() data: any;
  @ViewChild('map', {static: true}) mapElement: ElementRef;
  map: any;
  userMarker: any;
  mapInitialised: boolean = false;
  currentPos: GoogleCoordinate;
  apiKey: string = "AIzaSyA_u2fkanThpKMP4XxqLVfT9uK0puEfRns";
  private _unsubscribe: UnsubscribeCallback;                        // when "cancel route" is implemeted, simply update route by using GoogleStore.setRoute() and remove route from RouteStore

  constructor(
    private _geolocation: Geolocation,
    private _googleStore: GoogleStore,
    private _routeStore: RouteStore,
    private _outdoorRouteBuilder: OutdoorRouteBuilder
    ) {
      // subscribe to mapstore
      this._unsubscribe = this._googleStore.subscribe(() => {
        this._addRouteIfExist();
      });
    }

  ngOnInit() {
    this.loadGMaps();
  }

  private _addRouteIfExist() {
    if (this.data.id && this._routeStore.getRoute(this.data.id)) {
      google = this._googleStore.getGoogleMapState().google;
      this.map = this._googleStore.getGoogleMapState().map;

      this._outdoorRouteBuilder.buildRoute(this._routeStore.getRoute(this.data.id).route);
    }
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

    this._geolocation.getCurrentPosition().then((position) => {

      this.currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.currentPos,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      if (this.data.id && !this._routeStore.getRoute(this.data.id)) {
        this._googleStore.storeMap({id: this.data.id, google: google, map: this.map, route: false});        // new map state
      } 
      else {
        this._googleStore.updateGoogleMap({id: this.data.id, google: google, map: this.map, route: true}); // reload old map state
      } 

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

      // this.maintainMap(); //this doesn't release the map. So the FactoryComponent wasnt able to create a second map.

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  /*
  maintainMap(){
      let watch = this._geolocation.watchPosition();
      watch.subscribe((data) => {
        this.currentPos = new google.maps.LatLng( data.coords.latitude, data.coords.longitude );
        this.userMarker.setPosition( this.currentPos );
      });
  }
  */

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

  ngOnDestroy() {
    this._unsubscribe();    // release listener to google-store
  }

}
