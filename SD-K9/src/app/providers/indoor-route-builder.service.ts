import { Injectable } from "@angular/core";
import { RouteBuilder } from "../interfaces/route-builder";
import { Location } from '../helpers/location';
import { SVGManager } from './svg-manager.service';
import { Pathfinder } from './pathfinder.service';
import { SVGCoordinate } from '../interfaces/svg-coordinate.model';

@Injectable()
export class IndoorRouteBuilder implements RouteBuilder {
    constructor(private _svgManager: SVGManager, private _pathfinder: Pathfinder) {}

    async buildRoute(iInitialLocation: Location, iDestination: Location) {
        let initCoordinate : SVGCoordinate = iInitialLocation.getCoordinate();
        let finalCoordinate : SVGCoordinate = iDestination.getCoordinate();
        let building: string = initCoordinate.building;
        let floor: number = initCoordinate.floor;

        /* Removing the path already displayed if it exists */
        this._svgManager.removeSVGPath();

        // TODO: get the building and floor dynamically from class id
        // TODO: make it work for multiple floors
        /* Getting the shortest path as a list of nodes */
        let partOne = await this._pathfinder.getShortestPath(initCoordinate, finalCoordinate, building, floor);

        this._svgManager.drawSVGPath(partOne, true);

    }
}