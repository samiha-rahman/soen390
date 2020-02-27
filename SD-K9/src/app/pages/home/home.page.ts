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
  
  start: string = 'class-1';
  end: string = 'class-12';

  floor:number = 10;
  building:string = 'hall'

  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
    ) {}

  ngOnInit() { 
    this._initLocation = new Location();
    this._destination = new Location();
  }

  toSVGCoordinate(id: string, building: string, floor: number): SVGCoordinate {
    return {
      id: id,
      x: parseInt(document.getElementById(id)["cx"].baseVal.value),
      y: parseInt(document.getElementById(id)["cy"].baseVal.value),
      building: building,
      floor:floor
    };
  }

  // TODO: Base on user input, determine if we must use SVGCoordinate or GoogleCoordinate for Location.Coordinate
  getRouteTest() {
    this._initLocation.setCoordinate(this.toSVGCoordinate(this.start, this.building, this.floor));
    this._destination.setCoordinate(this.toSVGCoordinate(this.end, this.building, this.floor));
    this._mapCoordinator.getRoute(this._initLocation, this._destination, );
  }
}
