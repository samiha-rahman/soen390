import { Coordinate } from './coordinate';

export interface SVGCoordinate extends Coordinate {
    id: string,
    building: string,
    floor: number,
    x: number,
    y: number
}