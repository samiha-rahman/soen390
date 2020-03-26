import { Injectable } from "@angular/core";
import { SVGManager } from './svg-manager.service';
import { Pathfinder } from './pathfinder.service';
import { SVGCoordinate } from '../models/svg-coordinate.model';

@Injectable()
export class IndoorRouteBuilder {
    constructor(private _svgManager: SVGManager, private _pathfinder: Pathfinder) {}

    async buildRoute(initCoordinate: SVGCoordinate, finalCoordinate: SVGCoordinate) {
        let building: string = initCoordinate.building;
        let floor: number = initCoordinate.floor;

        /* Removing the path already displayed if it exists */
        this._svgManager.removeSVGPath();

        // TODO: get the building and floor dynamically from class id
        // TODO: make it work for multiple floors
        /* Getting the shortest path as a list of nodes */
        let path = await this._pathfinder.getShortestPath(initCoordinate, finalCoordinate, building, floor);
        this._svgManager.drawSVGPath(path, true);
    }
}