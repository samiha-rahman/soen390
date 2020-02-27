import { Injectable } from '@angular/core';
import { MapBuilder } from "../interfaces/map-builder";
import { ConcordiaCampus } from '../interfaces/concordia-campus';
import { IndoorMapData } from '../data-models/indoor-map-data';

@Injectable()
export class IndoorMapBuilder implements MapBuilder {
    private _userLocation: Location;
    private _POIs: Location[];

    constructor(private indoorMapData: IndoorMapData) {}
    
    setLocation(iLocation: Location) {}

    setPOI(iLocations: Location[]) {}

    setBuilding(iConcordiaCampus: ConcordiaCampus) {};

    buildMap() : IndoorMapData {
        return this.indoorMapData;
    }
}