import { RouteType } from "../models/route-type.enum.model";

export declare interface Route {
    id: number;
    route: any;     // SVGCoordinate | GoogleCoordinate | SourceDestination;
    type: RouteType
}