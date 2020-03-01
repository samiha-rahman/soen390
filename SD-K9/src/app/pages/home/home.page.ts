import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { Location } from '../../helpers/location';
import { ModalController, NavController } from '@ionic/angular';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { IonPullUpFooterState } from 'ionic-pullup';
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

  constructor(
    private _mapCoordinator: MapCoordinator,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
<<<<<<< HEAD

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
=======
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
>>>>>>> acf2b51bb9f8e01be45cba78706cf39d04e23d47
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
  
}
