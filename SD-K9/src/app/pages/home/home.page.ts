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
