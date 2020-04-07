import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map } from '../../interfaces/map';
import { GoogleCoordinate } from '../../models/google-coordinate.model';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { BuildingInfoStore } from '../../providers/state-stores/building-info-store.service';
import { BuildingInfoState } from 'src/app/interfaces/building-info-state';
import * as campusData from '../../../local-configs/campus.json';
import { environment } from '../../../environments/environment';

declare var google;

@Component({
  selector: 'app-outdoor-map',
  templateUrl: './outdoor-map.component.html',
  styleUrls: ['./outdoor-map.component.scss'],
})
export class OutdoorMapComponent implements OnInit, OnDestroy, Map {
  @Input() data: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  //cannot set type to google.maps.marker because google maps is not loaded yet
  buildingMarkers: any[] = [];
  buildingPolygons: any[] = [];
  userMarker: any;
  campusConfig: any = campusData["default"];
  mapInitialised: boolean = false;
  currentPos: GoogleCoordinate;
  apiKey: string = environment.apiKey;
  hasRoute: boolean;
  private _unsubscribeGoogleStore: UnsubscribeCallback;  
  private _campusConfig: any;
  currentCampus: string;
  currentBuilding: string;
  // when "cancel route" is implemeted, simply update route by using GoogleStore.setRoute() and remove route from RouteStore
  

  constructor(
    private _geolocation: Geolocation,
    private _googleStore: GoogleStore,
    private _routeStore: RouteStore,
    private _outdoorRouteBuilder: OutdoorRouteBuilder,
    private _buildingInfoStore: BuildingInfoStore,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    // subscribe to mapstore
    this._unsubscribeGoogleStore = this._googleStore.subscribe(() => {
      this._addRouteIfExist();
      this.currentBuilding = this._buildingInfoStore.getBuildingInfo().building;
      this.currentCampus = this._buildingInfoStore.getBuildingInfo().campus;
    });
  }

  ngOnInit() {
    this._loadGMaps();
    this.hasRoute = false;
    this._campusConfig = campusData["default"];
  }

  private _addRouteIfExist() {
    if (this.data.id && this._routeStore.getRoute(this.data.id)) {
      google = this._googleStore.getGoogleMapState().google;
      this.map = this._googleStore.getGoogleMapState().map;

      this._outdoorRouteBuilder.buildRoute(this._routeStore.getRoute(this.data.id).route);
      this.hasRoute = true;
    } else {
      this.hasRoute = false;
    }
  }

  private _loadGMaps() {
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      console.log("Google maps JavaScript needs to be loaded.");
      //Load the API
      window['initMap'] = () => {
        this._initMap();
      }
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&libraries=geometry&callback=initMap';
      document.body.appendChild(script);
    } else {
      this._initMap();
    }
  }

  private _initMap() {

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
        this._googleStore.storeMap({ id: this.data.id, google: google, map: this.map, route: false });        // new map state
      }
      else {
        this._googleStore.updateGoogleMap({ id: this.data.id, google: google, map: this.map, route: true }); // reload old map state
      }

      //add a marker on the current position
      this.userMarker = new google.maps.Marker({
        position: this.currentPos,
        map: this.map,
        title: 'You are here',
        icon: {
          url: 'assets/images/map-pin.png',
          scaledSize: new google.maps.Size(25, 44),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(12, 44)
        }
      });

      //draw buildings overlay from config file
      this._drawBuildings();

      //check if we should show/hide the building markers when the user zooms in/out
      let _self = this;
      google.maps.event.addListener(this.map, 'zoom_changed', function () {
        _self._hideShowMarkers(_self);
      });

      //switch flag to load map nav components
      this.mapInitialised = true;
      //check if user is inside building initially
      this.inCampus();
      //need to tell angular we changed something for ngIf to reload on template
      this.refresh();

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  private _drawBuildings() {
    //loop through both campus and all the buildings in each campus from the config file
    let counter = 0; //counter for polygonArr
    for (const campus in this.campusConfig) {
      for (const building in this.campusConfig[campus]["buildings"]) {
        let polygonBounds = this.campusConfig[campus]["buildings"][building]["bounds"];
        let buildingSlug = this.campusConfig[campus]["buildings"][building]["buildingSlug"];
        buildingSlug = typeof buildingSlug === 'undefined' ? '' : buildingSlug;

        //overlay each building
        let overlay = new google.maps.Polygon({
          paths: polygonBounds,
          strokeColor: '#A31B1B',
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: '#A31B1B',
          fillOpacity: 0.9,
          currentBuilding: building,
          currentCampus: campus,
          currentBuildingInfo: this.campusConfig[campus]["buildings"][building]["info"],
          buildingSlug: buildingSlug
        });
        //store all polygons inside array
        this.buildingPolygons[counter++] = overlay;
        //add the overlay to the map
        overlay.setMap(this.map);

        //add a marker to the overlay with the building label
        let marker = new google.maps.Marker({
          position: this.campusConfig[campus]["buildings"][building]["markerPos"],
          label: {
            text: this.campusConfig[campus]["buildings"][building]["markerText"],
            color: "white",
            fontSize: "22px"
          },
          visible: true,
          icon: {
            url: 'assets/images/transparent.png',
          },
          map: this.map
        });

        //show building info when clicked
        let _self = this;
        google.maps.event.addListener(overlay, 'click', function () {
          let buildingInfoState: BuildingInfoState = {
            campus: this.currentCampus,
            building: this.currentBuilding,
            slug: this.buildingSlug
          }
          _self._buildingInfoStore.setBuildingInfo(buildingInfoState);
          _self.refresh();
        });


        //keep track of the markers to hide/show them later
        this.buildingMarkers.push(marker);
      }
    }
  }

  toggleCampus(event) {
    let currentCampus = this.campusConfig[event.detail.value];
    this.map.panTo(new google.maps.LatLng(currentCampus["coords"]));
    this._hideShowMarkers(this);
  }

  locateUser() {
    this.map.panTo(this.currentPos);
    this._hideShowMarkers(this);
  }

  refresh() {
    this._changeDetectorRef.detectChanges();
  }

  private _hideShowMarkers(self) {
    let zoom = self.map.getZoom();
    // hide markers if too zoomed out
    for (let i = 0; i < self.buildingMarkers.length; i++) {
      self.buildingMarkers[i].setVisible(zoom >= 17);
    }
  }

  ngOnDestroy() {
    this._unsubscribeGoogleStore();    // release listener to google-store
  }

  inCampus(){
    let coordinates = new google.maps.LatLng(this.currentPos.lat,this.currentPos.lng);
    //let coordinates1 = new google.maps.LatLng(45.497307, -73.578971);   //to test Hall Building coordinates
    let isInside = false;
    let building = "";
    let polygonArr: any[] = [];
    polygonArr = this.buildingPolygons;
    //verify if user location is inside any campus building
    for(var i = 0; i < polygonArr.length; i++){
      isInside = google.maps.geometry.poly.containsLocation(coordinates, polygonArr[i]);
      if(isInside){
        building = polygonArr[i].currentBuilding;
        break;
      }
    }

    if(isInside){
      //display you are inside a campus building
      document.getElementById('btn').innerHTML = "You are in " + building + " building";
    }else{
      //display you are not in campus
      document.getElementById('btn').innerHTML = "You are not inside campus building";
    };
  }
}
