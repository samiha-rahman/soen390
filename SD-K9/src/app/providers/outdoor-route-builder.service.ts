import { Injectable } from "@angular/core";
import { RouteBuilder } from "../interfaces/route-builder";
import { Location } from '../helpers/location';

@Injectable()
export class OutdoorRouteBuilder implements RouteBuilder {
    constructor() {}

    buildRoute(iInitialLocation: Location, iDestination: Location) {
        console.log("Outdoor directions from google routes...");
    }
}