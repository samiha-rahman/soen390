import { FloorPOIs } from "../interfaces/floor-pois";
import { Location } from "../providers/location.service";
import { Injectable } from '@angular/core';

@Injectable()
export class ConcordiaCampus {
    floorPOIs: FloorPOIs[];

    constructor() {}

    getPOIs() {};

    setPOIs() {};

    getInfo() {};

    setInfo() {};

    // testing pattern
    containsPoint(iLocation: Location) : boolean {
        if (iLocation.getCoordinate().latitude >= 45
            && iLocation.getCoordinate().longitude <= -70) {
                return true;
            }
        return false;
    }
}