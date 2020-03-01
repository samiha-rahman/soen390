import { GoogleCoordinate } from '../interfaces/google-coordinate.model';
import { Coordinate } from '../interfaces/coordinate';
import { SVGCoordinate } from '../interfaces/svg-coordinate.model';

export class Location {
    // TODO: create an interface for Coordinate and PositionNode
    private coordinate: SVGCoordinate;

    constructor() {}

    getCoordinate() {
        return this.coordinate;
    }

    setCoordinate(iCoordinate: SVGCoordinate) {
        this.coordinate = iCoordinate;
    }

    equals(iLocation: Location) : boolean {
        return this.coordinate.y == iLocation.getCoordinate().y && this.coordinate.x == iLocation.getCoordinate().x;
    }

}