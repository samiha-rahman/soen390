import { Injectable } from '@angular/core';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { SVGManager } from './svg-manager.service';
import { SVGCoordinate } from '../models/svg-coordinate.model';

@Injectable({
  providedIn: 'root'
})
export class IndoorRouteCoordinator {
  private _verticalTransportationMode = 'escalators';
  private _hasNextRoute: boolean = false;
  private _routeLocationList = [];

  constructor(
    private _indoorRouteBuilder: IndoorRouteBuilder,
    private _outdoorRouteBuilder: OutdoorRouteBuilder,
    private _svgManager: SVGManager,
  ) { }

  async getIndoorRoute(iInitLocation: SVGCoordinate, iDestination: SVGCoordinate) {
    this._routeLocationList = [];
    
    if (iInitLocation.id && iDestination.id) {
        if (iInitLocation.building === iDestination.building &&
        iInitLocation.floor === iDestination.floor) {
                // if same building and same floor
            this._indoorRouteBuilder.buildRoute(iInitLocation, iDestination);
            this._hasNextRoute = false;
        } else { // else different floor
            await this.generateRouteLocations(iInitLocation, iDestination);
            this.nextRoute();
        }
    }
  }

  routeLocation(fromL: SVGCoordinate, toL: SVGCoordinate) {
    return(
        {
            from: fromL,
            to: toL
        }
    );
  }

  async generateRouteLocations(initLocation: SVGCoordinate, finalLocation: SVGCoordinate) {
    let firstvTransportation: SVGCoordinate;
    let secondvTransportation: SVGCoordinate;
    let direction;
    if (initLocation.building === finalLocation.building){
        if (initLocation.floor < finalLocation.floor) {
          direction = 'up';
        } else {
          direction = 'down';
        }
        const vTransportationId = await this._svgManager.getClosestVerticalTransportationId(this._verticalTransportationMode, direction,
          finalLocation
        );
        firstvTransportation = await this._svgManager.getSVGCoordFromID(
            vTransportationId,
            this._verticalTransportationMode,
            initLocation.building,
            initLocation.floor
        );
        this._routeLocationList.push(this.routeLocation(initLocation, firstvTransportation));
        secondvTransportation = await this._svgManager.getSVGCoordFromID(
          vTransportationId,
          this._verticalTransportationMode,
          finalLocation.building,
          finalLocation.floor
        );
        this._routeLocationList.push(this.routeLocation(secondvTransportation, finalLocation));
    }
    this._hasNextRoute = true;
  }

  setVerticalTransportationMode(mode: string) {
    this._verticalTransportationMode = mode;
  }

  async nextRoute() {
    this._indoorRouteBuilder.buildRoute(this._routeLocationList[0].from, this._routeLocationList[0].to);
    this._routeLocationList.shift();
    if (this._routeLocationList.length === 0) {
        this._hasNextRoute = false;
    }
  }

  hasNextRoute() {
    return this._hasNextRoute;
  }
}
