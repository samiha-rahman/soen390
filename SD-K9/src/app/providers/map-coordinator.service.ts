import { Injectable } from "@angular/core";
import { MapItem } from '../helpers/map-item';
import { Location } from '../helpers/location';
import { RouteNavigator } from '../helpers/route-navigator';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { SVGManager } from './svg-manager.service';
import { FloorPlanComponent } from '../components/floor-plan/floor-plan.component';
import { OutdoorMapComponent } from '../components/outdoor-map/outdoor-map.component';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: MapItem = new MapItem(Location, '');
    private _initLocation: Location;
    private _finalLocation: Location;
    private _verticalTransportationMode = 'escalators';
    private _hasNextRoute: boolean = false;
    private _routeLocationList = [];

    constructor(
        private _indoorRouteBuilder: IndoorRouteBuilder,
        private _svgManager: SVGManager
    ) {}

    ngOnInit() {
        this._initLocation = new Location();
        this._finalLocation = new Location();
    }
    
    // Refactor code once google maps is integrated
    getMap(type: string) : MapItem {
        if (type == 'hall') {
            return new MapItem(FloorPlanComponent, {floor: 8, building: type});
        }
        else {
            return new MapItem(OutdoorMapComponent, {});
        }
    }
    
    // Refactor code
    // TODO: implement the proper code to accomodate a combination of indoor and outdoor routes
    async getRoute(iInitLocation: Location, iDestination: Location) {
        this._initLocation = iInitLocation;
        this._finalLocation = iDestination;
        this._routeLocationList = [];

        // TODO: check if SVGCoordinate of GoogleCoordinate
        if (this._initLocation.getCoordinate().id && this._finalLocation.getCoordinate().id) {
            if (this._initLocation.getCoordinate().building === this._finalLocation.getCoordinate().building &&
                this._initLocation.getCoordinate().floor === this._finalLocation.getCoordinate().floor) {
                    // if same building and same floor
                let hallRouteNavigator: RouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
                hallRouteNavigator.getRoute(this._initLocation, this._finalLocation);
                this._hasNextRoute = false;
            } else { // else different floor
                await this.generateRouteLocations(this._initLocation, this._finalLocation);
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
