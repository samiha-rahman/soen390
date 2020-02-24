import { Injectable } from "@angular/core";
import { MapBuilder } from "../interfaces/map-builder";
import { OutdoorMapData } from '../data-models/outdoor-map-data';

@Injectable()
export class OutdoorMapBuilder implements MapBuilder {
    private _userLocation: Location;
    private _POIs: Location[];
    

    constructor(private outdoorMapData: OutdoorMapData) {}
    
    setLocation(iLocation: Location) { }

    setPOI(iLocations: Location[]) {}

    buildMap() : OutdoorMapData {
        return this.outdoorMapData;
    }
}