import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapItem } from 'src/app/helpers/map-item';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SourceDestination } from '../../interfaces/source-destination';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('searchbar', {read: ElementRef, static: false}) searchbar: ElementRef;
  maps: MapItem[];
  directionForm: FormGroup;
  transportMode: string;
  indoorMode: string;
  
  private _unsubscribe: UnsubscribeCallback;
  map: any;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _fb: FormBuilder,
    private _googleStore: GoogleStore
  ) { 
    this.createDirectionForm();
    this._unsubscribe = this._googleStore.subscribe(() => {
      this.map = this._googleStore.getGoogleMapState().map;
      google = this._googleStore.getGoogleMapState().google;
      this.searchplaces();
    });
  }
  
  ngOnInit() {
    this.maps = [this._mapCoordinator.getMap()];
  }

  //Verify form
  createDirectionForm() {
    this.directionForm = this._fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  calculateAndDisplayRoute(formValues: SourceDestination) {
    let tempMaps: Promise<MapItem[]> = this._mapCoordinator.getOverallRoute(formValues);
    tempMaps.then((maps) => {
      if (maps.length > 0) {
        this.maps = maps;
      }
    });
  }

  getIndoorMode(event): string {
    switch (event.detail.value) {
      case "LOYOLA": {
        this.indoorMode = "LOYOLA";
        this.maps = [this._mapCoordinator.getMap(this.indoorMode.toLowerCase())];
        break;
      }
      case "HALL":{
        this.indoorMode = "HALL";
        this.maps = [this._mapCoordinator.getMap(this.indoorMode.toLowerCase())];
        break;
      }
      default: {
        this.indoorMode = "DISABLED" ;
        this.maps = [this._mapCoordinator.getMap()];
      }
    } 
    return this.indoorMode;
  }

  //Travel mode selected
  mode(event): string {
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

  searchplaces(){
    var input = this.searchbar.nativeElement.querySelector('.searchbar-input') as HTMLInputElement;
    console.log(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
    console.log('asd');
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
    let map = this.map;
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
        map.fitBounds(place.geometry.viewport);
      }
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
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
      infowindow.open(map, marker); // Display the information of marker
    });
  }

  ngOnDestroy() {
    this._unsubscribe();    // release listener to google-store
  }

}
