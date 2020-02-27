import { Injectable } from "@angular/core";
import { RouteBuilder } from "../interfaces/route-builder";
import { Location } from '../helpers/location';

@Injectable()
export class IndoorRouteBuilder implements RouteBuilder {
    constructor() {}

    buildRoute(iInitialLocation: Location, iDestination: Location) {
        console.log("Indoor Directions...");
    }
}