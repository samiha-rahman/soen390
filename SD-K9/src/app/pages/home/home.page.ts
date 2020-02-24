import { Component } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { Location } from '../../providers/location.service';
import { Map } from 'src/app/interfaces/map';
import { Coordinate } from 'src/app/interfaces/coordinate';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  returnedData: string;

  constructor(
    private mapCoordinator: MapCoordinator,
    private initLocation: Location,
    private destination: Location
    ) {}

  ngOnInit() {}

  getMapTest(iNumber: number) {
    let coordinate: Coordinate;
    if (iNumber == 1) {
      coordinate = {latitude: 45.495398, longitude: -73};
    }
    else {
      coordinate = {latitude: 0, longitude: 0};
    }
    this.initLocation.setCoordinate(coordinate);
    let map : Map = this.mapCoordinator.getMap(this.initLocation);
    // console.log(map);
    console.log(coordinate.latitude + ", " + coordinate.longitude);

    this.returnedData = map.testText;
  }

}
