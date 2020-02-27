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

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: Map = {testText: ''};
    private _initLocation: Location;
    private _finalLocation: Location;

    constructor(
        private _hallBuildingData: HallBuildingData,
        private _loyolaCampusData: LoyolaCampusData,
        private _indoorMapBuilder: IndoorMapBuilder,
        private _outdoorMapBuilder: OutdoorMapBuilder,
        private _indoorRouteBuilder: IndoorRouteBuilder,
        private _outdoorRouteBuilder: OutdoorRouteBuilder
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
    // the following is just to test the design pattern
    // the conditions can be literal if we only have Hall building and Loyola Campus
    // if we must integrate ALL concordia buildings, a pattern should be considered for this.
    getRoute(iInitLocation: Location, iDestination: Location) {
        this._initLocation = iInitLocation;
        this._finalLocation = iDestination;
        console.log(this._initLocation);
        console.log(this._finalLocation);

        if (this._hallBuildingData.containsPoint(this._initLocation)) {
            console.log("directions start at hall building");
            let hallRouteNavigator = new RouteNavigator(this._indoorRouteBuilder);

            if (this._hallBuildingData.containsPoint(this._finalLocation)) {
                console.log("directions end at hall building");
                hallRouteNavigator.getRoute(iInitLocation, iDestination);
            }
            else if (this._loyolaCampusData.containsPoint(this._finalLocation)) {
                let exitHallBldg = iDestination; // this should be the actual exit location
                hallRouteNavigator.getRoute(iInitLocation, exitHallBldg);
                console.log("directions continues outside with google maps...")

                let outdoorRouteNavigator = new RouteNavigator(this._outdoorRouteBuilder);
                let entranceLoyola = iDestination; // this should be the actual entrance locaiton of loyola
                outdoorRouteNavigator.getRoute(exitHallBldg, entranceLoyola);

                console.log("directions end at hall building");
                let loyolaRouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
                loyolaRouteNavigator.getRoute(entranceLoyola, iDestination);
            }
            else {
                let exitHallBldg = iDestination; // this should be the actual exit location
                hallRouteNavigator.getRoute(iInitLocation, exitHallBldg);

                let outdoorRouteNavigator = new RouteNavigator(this._outdoorRouteBuilder);
                outdoorRouteNavigator.getRoute(exitHallBldg, iDestination);
            }
        }
    }

}