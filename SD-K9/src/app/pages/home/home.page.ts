import { Component, OnDestroy } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { Location } from '../../helpers/location';
import { Map } from 'src/app/interfaces/map';
import { GoogleCoordinate } from 'src/app/interfaces/google-coordinate.model';
import { SVGCoordinate } from 'src/app/interfaces/svg-coordinate.model';
import { IndoorRouteBuilder } from 'src/app/providers/indoor-route-builder.service';

/** Use this Component to test manually */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  showFloorPlan: boolean = true;
  hasNextRoute: boolean = false;
 
  start: string = 'H-831';
  end: string = 'H-815';

  floor: number = 8;
  building: string = 'hall';

  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
  ) { }

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
  }

  toSVGCoordinate(id: string): SVGCoordinate {
    let building;
    let floor;
    if (id.split('-')[0] === 'H') {
      building = 'hall';
    } else {
      building = 'loyola';
    };
    if (id.split('-')[1].length === 3) {
      floor = parseInt(id.split('-')[1].substr(0, 1));
    } else {
      floor = parseInt(id.split('-')[1].substr(0, 2));
    }
    console.log(id, floor, building);
    return {
      id: id,
      x: parseInt(document.getElementById(id)["cx"].baseVal.value),
      y: parseInt(document.getElementById(id)["cy"].baseVal.value),
      building: building,
      floor: floor
    };
  }

  // TODO: Base on user input, determine if we must use SVGCoordinate or GoogleCoordinate for Location.Coordinate
  getRouteTest() {
    this._initLocation.setCoordinate(this.toSVGCoordinate(this.start));
    this._destination.setCoordinate(this.toSVGCoordinate(this.end));

    this._mapCoordinator.getRoute(this._initLocation, this._destination);

    this.hasNextRoute = this._mapCoordinator.hasNextRoute();
  }

  nextRoute() {
    this._mapCoordinator.nextRoute();
    this.floor = this._destination.getCoordinate().floor;
}
