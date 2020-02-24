import { Map } from "./map";

export declare interface MapBuilder {
    setLocation(iLocation: Location);

    setPOI(iLocations: Location[]);

    buildMap() : Map;
}