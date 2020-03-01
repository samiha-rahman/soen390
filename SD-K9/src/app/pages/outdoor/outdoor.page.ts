import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { Location } from '../../helpers/location';
import { ModalController } from '@ionic/angular';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { IonPullUpFooterState } from 'ionic-pullup';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SVGCoordinate } from 'src/app/interfaces/svg-coordinate.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var google;


@Component({
  selector: 'app-outdoor',
  templateUrl: './outdoor.page.html',
  styleUrls: ['./outdoor.page.scss'],
})
export class OutdoorPage implements OnInit, AfterViewInit {
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  userMarker: any;
  mapInitialised: boolean = false;
  currentPos: any;
  apiKey: string = "AIzaSyA_u2fkanThpKMP4XxqLVfT9uK0puEfRns";

  //Google direction service  
  directionsService: any;
  directionsDisplay: any;
  transportMode: String = "DRIVING"; //Default travel mode
  directionForm: FormGroup;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private modalController: ModalController,
    private geolocation: Geolocation,
    private fb: FormBuilder
    ) {
      this.loadGMaps();
      this.createDirectionForm();
    }

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
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
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

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
      //Display direction on map
      this.directionsDisplay.setMap(this.map);
      //TODO: Find container to put text directions
      //this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));

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

  //Verify form
  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  //Calculate shortest path for outdoor map
  calculateAndDisplayRoute(formValues) {
    this.directionsService.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: this.transportMode
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  //Travel mode selected
  mode(event){
    if(event.detail.value == "DRIVING"){
      this.transportMode = "DRIVING"
    }else if(event.detail.value == "WALKING"){
      this.transportMode = "WALKING"
    }else if(event.detail.value == "BICYCLING"){
      this.transportMode = "BYCYCLING"
    }else if(event.detail.value == "TRANSIT"){
      this.transportMode = "TRANSIT"
    }
    return this.transportMode;
  }

}
