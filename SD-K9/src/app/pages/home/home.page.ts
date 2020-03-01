import { Component } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { SVGManager } from 'src/app/providers/svg-manager.service';
import { Location } from '../../helpers/location';
import { SVGCoordinate } from 'src/app/interfaces/svg-coordinate.model';

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
  end: string = 'H-615';

  floor: number = 8;
  building: string = 'hall';

  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _svgService: SVGManager
  ) { }

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
  }

  async toSVGCoordinate(id: string) {
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
    let svgCoordinate: SVGCoordinate;
    svgCoordinate = await this._svgService.getClassroom(id, building, floor);

    return(svgCoordinate);
  }

  // TODO: Base on user input, determine if we must use SVGCoordinate or GoogleCoordinate for Location.Coordinate
  async getRouteTest() {
    this._initLocation.setCoordinate(await this.toSVGCoordinate(this.start));
    this._destination.setCoordinate(await this.toSVGCoordinate(this.end));
    this.floor = this._initLocation.getCoordinate().floor;

    await this._mapCoordinator.getRoute(this._initLocation, this._destination);
    this.hasNextRoute = this._mapCoordinator.hasNextRoute();
  }

  async nextRoute() {
    this.floor = this._destination.getCoordinate().floor;
    // TODO: Call nextRoute only after floorplan has updated
    // sleep for 5ms
    await new Promise(r => setTimeout(r, 5));
    await this._mapCoordinator.nextRoute();
    this.hasNextRoute = this._mapCoordinator.hasNextRoute();
  }
}
