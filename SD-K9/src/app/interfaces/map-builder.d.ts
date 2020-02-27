import { Map } from "./map";
import { ConcordiaCampus } from "./concordia-campus";

export declare interface MapBuilder {
    setLocation(iLocation: Location);

    setPOI(iLocations: Location[]);

    setBuilding(iConcordiaCampus?: ConcordiaCampus);

    buildMap() : Map;
}