import { Injectable } from '@angular/core';
import { Location } from '../helpers/location';
import { RouteNavigator } from '../helpers/route-navigator';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { SVGManager } from './svg-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RouteCoordinator {
  private _verticalTransportationMode = 'escalators';
  private _hasNextRoute: boolean = false;
  private _routeLocationList = [];

  constructor(
    private _indoorRouteBuilder: IndoorRouteBuilder,
    private _outdoorRouteBuilder: OutdoorRouteBuilder,
    private _svgManager: SVGManager,
  ) { }

  async getIndoorRoute(iInitLocation: Location, iDestination: Location) {
    this._routeLocationList = [];

    // TODO: check if SVGCoordinate of GoogleCoordinate
    if (iInitLocation.getCoordinate().id && iDestination.getCoordinate().id) {
        if (iInitLocation.getCoordinate().building === iDestination.getCoordinate().building &&
        iInitLocation.getCoordinate().floor === iDestination.getCoordinate().floor) {
                // if same building and same floor
            let hallRouteNavigator: RouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
            hallRouteNavigator.getRoute(iInitLocation, iDestination);
            this._hasNextRoute = false;
        } else { // else different floor
            await this.generateRouteLocations(iInitLocation, iDestination);
            this.nextRoute();
        }
    }
  }

  routeLocation(fromL: Location, toL: Location) {
    return(
        {
            from: fromL,
            to: toL
        }
    );
  }

  async generateRouteLocations(initLocation: Location, finalLocation: Location) {
    const firstvTransportation = new Location();
    const secondvTransportation = new Location();
    let direction;
    if (initLocation.getCoordinate().building === finalLocation.getCoordinate().building){
        if (initLocation.getCoordinate().floor < finalLocation.getCoordinate().floor) {
            direction = 'up';
        } else {
            direction = 'down';
        }
        const vTransportationId = await this._svgManager.getClosestVerticalTransportationId(this._verticalTransportationMode, direction,
            finalLocation.getCoordinate().building,
            finalLocation.getCoordinate().floor,
            finalLocation);
        firstvTransportation.setCoordinate(await this._svgManager.getVerticalTransportation(
            vTransportationId,
            this._verticalTransportationMode,
            initLocation.getCoordinate().building,
            initLocation.getCoordinate().floor));
        this._routeLocationList.push(this.routeLocation(initLocation, firstvTransportation));
        secondvTransportation.setCoordinate(await this._svgManager.getVerticalTransportation(
            vTransportationId,
            this._verticalTransportationMode,
            finalLocation.getCoordinate().building,
            finalLocation.getCoordinate().floor));
        this._routeLocationList.push(this.routeLocation(secondvTransportation, finalLocation));
    }
    this._hasNextRoute = true;
  }

  setVerticalTransportationMode(mode: string) {
    this._verticalTransportationMode = mode;
  }

  async nextRoute() {
    const routeNavigator: RouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
    routeNavigator.getRoute(this._routeLocationList[0].from, this._routeLocationList[0].to);
    this._routeLocationList.shift();
    if (this._routeLocationList.length === 0) {
        this._hasNextRoute = false;
    }
  }

  hasNextRoute() {
    return this._hasNextRoute;
  }
}
