import { Injectable } from "@angular/core";
import { ConcordiaCampus } from "../interfaces/concordia-campus";
import { FloorPOIs } from '../interfaces/floor-pois.model';
import { Location } from '../helpers/location';

@Injectable()
export class HallBuildingData implements ConcordiaCampus {
    floorPOIs: FloorPOIs[];

    constructor() {}
    
    getPOIs() {
        throw new Error("Method not implemented.");
    }
    setPOIs() {
        throw new Error("Method not implemented.");
    }
    getInfo() {
        throw new Error("Method not implemented.");
    }
    setInfo() {
        throw new Error("Method not implemented.");
    }
    containsPoint(iLocation: Location): boolean {
        return iLocation.getCoordinate().latitude == 45.495398 && iLocation.getCoordinate().longitude == -73;
    }
}