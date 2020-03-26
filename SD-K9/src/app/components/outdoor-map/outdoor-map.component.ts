import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input,ChangeDetectorRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map } from '../../interfaces/map';
import { GoogleCoordinate } from '../../models/google-coordinate.model';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import * as campusData from '../../../local-configs/campus.json';


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
  //cannot set type to google.maps.marker because google maps is not loaded yet
  buildingMarkers: any[] = [];
  userMarker: any;
  campusConfig: any = campusData.default;
  mapInitialised: boolean = false;
  currentPos: GoogleCoordinate;
  apiKey: string = "AIzaSyA_u2fkanThpKMP4XxqLVfT9uK0puEfRns";
  private _unsubscribe: UnsubscribeCallback;                        // when "cancel route" is implemeted, simply update route by using GoogleStore.setRoute() and remove route from RouteStore

  constructor(
    private _geolocation: Geolocation,
    private _googleStore: GoogleStore,
    private _routeStore: RouteStore,
    private _outdoorRouteBuilder: OutdoorRouteBuilder,
    private cd: ChangeDetectorRef
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
      //Load the API
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

    this._geolocation.getCurrentPosition().then((position) => {

      this.currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.currentPos,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //update or load from google map state
      if (this.data.id && !this._routeStore.getRoute(this.data.id)) {
        this._googleStore.storeMap({id: this.data.id, google: google, map: this.map, route: false});        // new map state
      }
      else {
        this._googleStore.updateGoogleMap({id: this.data.id, google: google, map: this.map, route: true}); // reload old map state
      }

      //add a marker on the current position
      this.userMarker = new google.maps.Marker({
        position: this.currentPos,
        map: this.map,
        title: 'You are here',
        icon: {
          url: 'assets/images/map-pin.png',
          scaledSize: new google.maps.Size(25, 44),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(12, 44)
        }
      });

      //draw buildings overlay from config file
      this.drawBuildings();

      //check if we should show/hide the building markers when the user zooms in/out
      let _self = this;
      google.maps.event.addListener(this.map, 'zoom_changed', function() {
          _self.hideShowMarkers(_self);
      });

      //switch flag to load map nav components
      this.mapInitialised = true;

      //need to tell angular we changed something for ngIf to reload on template
      this.refresh();

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  drawBuildings(){
    //loop through both campus and all the buildings in each campus from the config file
    for (const campus in this.campusConfig) {
      for (const building in this.campusConfig[campus]["buildings"]) {
        let polygonBounds = this.campusConfig[campus]["buildings"][building]["bounds"];
        //overlay each building
        let overlay = new google.maps.Polygon({
          paths: polygonBounds,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        //add the overlay to the map
        overlay.setMap(this.map);

        //add a marker to the overlay with the building label
        let marker = new google.maps.Marker({
          position: this.campusConfig[campus]["buildings"][building]["markerPos"],
          label: {
            text: this.campusConfig[campus]["buildings"][building]["markerText"],
            color: "white",
            fontSize: "26px"
          },
          visible: true,
          icon:{
            url: 'assets/images/transparent.png',
          },
          map: this.map
        });

        //keep track of the markers to hide/show them later
        this.buildingMarkers.push(marker);
      }
    }
  }

  toggleCampus(event){
    let currentCampus = this.campusConfig[event.detail.value];
    this.map.panTo(new google.maps.LatLng(currentCampus["coords"]));
    this.hideShowMarkers(this);
  }

  locateUser(){
    this.map.panTo(this.currentPos);
    this.hideShowMarkers(this);
  }

  refresh(){
    this.cd.detectChanges();
  }

  hideShowMarkers(self){
    let zoom = self.map.getZoom();
    // hide markers if too zoomed out
    for(let i = 0; i < self.buildingMarkers.length; i++) {
      self.buildingMarkers[i].setVisible(zoom >= 17);
    }
  }

  ngOnDestroy() {
    this._unsubscribe();    // release listener to google-store
  }

}
