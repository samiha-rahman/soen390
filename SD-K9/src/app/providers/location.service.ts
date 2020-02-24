import { Injectable } from '@angular/core';
import { Coordinate } from '../interfaces/coordinate';

@Injectable()
export class Location {
    private coordinate: Coordinate = {latitude: 0, longitude: 0};

    constructor() {}

    getCoordinate() {
        return this.coordinate;
    }

    setCoordinate(iCoordinate: Coordinate) {
        this.coordinate = iCoordinate;
    }

}