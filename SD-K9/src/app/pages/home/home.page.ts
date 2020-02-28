import { Component, OnDestroy } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { Location } from '../../helpers/location';
import { Map } from 'src/app/interfaces/map';
import { Coordinate } from 'src/app/interfaces/coordinate.model';
import { TestService } from '../../helpers/test-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnDestroy {
  returnedData: string;
  currentCoordinate: Coordinate = {latitude: 0, longitude: 0};
  currentLoc: number;
  finalLoc: number;
  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
    ) {}

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();

    // BELOW IS GOOGLE PLACES API
    var input = document.getElementById('search-input'); // Retrieves input location of search bar
    var autocomplete = new google.maps.places.Autocomplete(input);
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);
    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
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
      infowindow.open(map, marker); // Display the information when clicking on marker
    });
    // END OF GOOGLE PLACES API
  }

  checkLocation(iNumber: number) : Coordinate {
    let tempCoordinate: Coordinate = {latitude: 0, longitude: 0};
    if (iNumber == 1) {
      tempCoordinate = {latitude: 45.495398, longitude: -73};
    }
    else if (iNumber == 2) {
      tempCoordinate = {latitude: 48, longitude: -80};
    }
    else {
      tempCoordinate = {latitude: 0, longitude: 0};
    }
    console.log(tempCoordinate);
    return tempCoordinate;
  }

  getMapTest(iNumber: number) {
    this.currentCoordinate = this.checkLocation(iNumber);
    this._initLocation.setCoordinate(this.currentCoordinate);
    let map : Map = this._mapCoordinator.getMap(this._initLocation);

    this.returnedData = map.testText;
  }

  getRouteTest() {
    console.log(this.currentLoc + ", " + this.finalLoc);
    this._initLocation.setCoordinate(this.checkLocation(this.currentLoc));
    this._destination.setCoordinate(this.checkLocation(this.finalLoc));
    this._mapCoordinator.getRoute(this._initLocation, this._destination);
  }

  ngOnDestroy() {
    // implement destroy
  }

}
