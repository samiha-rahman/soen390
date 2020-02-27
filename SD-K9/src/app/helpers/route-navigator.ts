import { RouteBuilder } from '../interfaces/route-builder';
import { Location } from './location';


export class RouteNavigator {
    private _routeBuilder: RouteBuilder;
    
    constructor(iRouteBuilder: RouteBuilder) {
        this._routeBuilder = iRouteBuilder;
    }

    getRoute(iInitLocation: Location, iDestination: Location) {
        this._routeBuilder.buildRoute(iInitLocation, iDestination);
    }
}