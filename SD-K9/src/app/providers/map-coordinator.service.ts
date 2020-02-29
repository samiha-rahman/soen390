import { Injectable } from "@angular/core";
import { MapDirector } from '../helpers/map-director';
import { Map } from '../interfaces/map';
import { Location } from '../helpers/location';
import { IndoorMapBuilder } from './indoor-map-builder.service';
import { OutdoorMapBuilder } from './outdoor-map-builder.service';
import { HallBuildingData } from '../data-models/hall-building-data';
import { LoyolaCampusData } from '../data-models/loyola-campus-data';
import { RouteNavigator } from '../helpers/route-navigator';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { SVGCoordinate } from '../interfaces/svg-coordinate.model';
import { SVGManager } from './svg-manager.service';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: Map = {testText: ''};
    private _initLocation: Location;
    private _finalLocation: Location;
    private _hasNextRoute: boolean = false;
    private _routeLocationList = [];

    constructor(
        private _hallBuildingData: HallBuildingData,
        private _loyolaCampusData: LoyolaCampusData,
        private _indoorMapBuilder: IndoorMapBuilder,
        private _outdoorMapBuilder: OutdoorMapBuilder,
        private _indoorRouteBuilder: IndoorRouteBuilder,
        private _outdoorRouteBuilder: OutdoorRouteBuilder,
        private _svgManager: SVGManager
    ) {}

    ngOnInit() {
        this._initLocation = new Location();
        this._finalLocation = new Location();
    }
    
    // Refactor code once google maps is integrated
    getMap(iInitLocation: Location, iDestination?: Location) : Map {
        let mapDirector = new MapDirector();
        this._initLocation = iInitLocation;
        
        if (iDestination) {
            this._finalLocation = iDestination;
        }

        // if Location is within boundary of campus
        //    load indoorMapBuilder.
        // i.e if Point exists in Polygon 
        //     -> Google Maps
        // for testing pattern, polygon is one point only :)
        if (this._hallBuildingData.containsPoint(this._initLocation)) {
            console.log("inside Hall Building")
            this.map = mapDirector.makeIndoorMap(this._indoorMapBuilder, this._hallBuildingData);
        }
        else if (this._loyolaCampusData.containsPoint(this._initLocation)) {
            console.log("inside Loyola Campus");
            this.map = mapDirector.makeIndoorMap(this._indoorMapBuilder, this._loyolaCampusData);
        }
        else  {
            console.log("outside campus")
            this.map = mapDirector.makeOutdoorMap(this._outdoorMapBuilder);
        }
        // console.log(this.map);

        return this.map;
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
        let firstvTransportation = new Location();
        let secondvTransportation = new Location();
        let direction;
        if (initLocation.getCoordinate().building === finalLocation.getCoordinate().building){
            if (initLocation.getCoordinate().floor < finalLocation.getCoordinate().floor) {
                direction = 'up';
            } else {
                direction = 'down';
            }
            firstvTransportation.setCoordinate(await this._svgManager.getVerticalTransportation(
                'escalators', direction,
                initLocation.getCoordinate().building,
                initLocation.getCoordinate().floor));
            this._routeLocationList.push(this.routeLocation(initLocation, firstvTransportation));
            secondvTransportation.setCoordinate(await this._svgManager.getVerticalTransportation(
                'escalators', direction,
                finalLocation.getCoordinate().building,
                finalLocation.getCoordinate().floor));
            this._routeLocationList.push(this.routeLocation(secondvTransportation, finalLocation));
        }
        this._hasNextRoute = true;
    }

    async nextRoute() {
        let routeNavigator: RouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
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
