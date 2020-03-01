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
  selector: 'app-outdoor',
  templateUrl: './outdoor.page.html',
  styleUrls: ['./outdoor.page.scss'],
})
export class OutdoorPage implements OnInit {
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
      script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&libraries=places&callback=initMap';
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

      this.searchautocomplete();

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

  searchautocomplete(){
    var input = document.getElementById('search-input'); // Retrieves input location of search bar
    var autocomplete = new google.maps.places.Autocomplete(input);
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', this.map);
    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener('place_changed', function () {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      }
      else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(this.map, marker); // Display the information of marker
    });

  }

}
