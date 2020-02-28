import { Coordinate } from '../interfaces/coordinate.model';

export class Location {
    // TODO: create an interface for Coordinate and PositionNode
    private coordinate: Coordinate = {latitude: 0, longitude: 0};

    constructor() {}

    getCoordinate() {
        return this.coordinate;
    }

    setCoordinate(iCoordinate: Coordinate) {
        this.coordinate = iCoordinate;
    }

    equals(iLocation: Location) : boolean {
        return this.coordinate.latitude == iLocation.getCoordinate().latitude && this.coordinate.longitude == iLocation.getCoordinate().longitude;
    }

}