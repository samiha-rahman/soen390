import { Injectable } from "@angular/core";
import { MapDirector } from './map-director.service';
import { Map } from '../interfaces/map';
import { Location } from './location.service';
import { ConcordiaCampus } from '../data-models/concordia-campus-data';
import { IndoorMapBuilder } from './indoor-map-builder.service';
import { OutdoorMapBuilder } from './outdoor-map-builder.service';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    initLocation: Location;
    destination: Location;
    map: Map = {testText: ''};

    constructor(
        private mapDirector: MapDirector,
        private concordiaCampus: ConcordiaCampus,
        private indoorMapBuilder: IndoorMapBuilder,
        private outdoorMapBuilder: OutdoorMapBuilder
    ) {}

    getMap(iInitLocation: Location, iDestination?: Location) : Map {
        this.initLocation = iInitLocation;
        
        if (iDestination) {
            this.destination = iDestination;
        }

        // if Location is within boundary of campus
        //    load indoorMapBuilder.
        // i.e if Point exists in Polygon 
        //     -> Google Maps
        // for testing pattern, polygon is one point only :)
        if (this.concordiaCampus.containsPoint(this.initLocation)) {
            console.log("inside if statement")
            this.map = this.mapDirector.makeIndoorMap(this.indoorMapBuilder);
        }
        else  {
            console.log("inside else statement")
            this.map = this.mapDirector.makeOutdoorMap(this.outdoorMapBuilder);
        }
        // console.log(this.map);

        return this.map;
    }

    setRoute(iInitLocation: Location, iDestination: Location) {

        // Logic for integration RouteBuilder here
        // getMap(iInitLocation, iDestination);
        // ...
    }

}