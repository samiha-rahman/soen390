import { Component, OnInit } from '@angular/core';
import { MapCoordinator } from '../providers/map-coordinator.service';
import { SVGCoordinate } from '../interfaces/svg-coordinate.model';
import { Location } from '../helpers/location';

@Component({
  selector: 'app-temp-indoor-page',
  templateUrl: './temp-indoor-page.page.html',
  styleUrls: ['./temp-indoor-page.page.scss'],
})
export class TempIndoorPagePage implements OnInit {

  showFloorPlan = true;

  start = 'H-831';
  end = 'H-815';

  floor = 8;
  building = 'hall';

  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
  ) { }

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
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

}
