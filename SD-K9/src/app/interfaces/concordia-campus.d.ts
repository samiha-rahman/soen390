import { FloorPOIs } from "./floor-pois.model";
import { Location } from "../helpers/location";

export declare interface ConcordiaCampus {
    floorPOIs: FloorPOIs[];

    getPOIs();

    setPOIs();

    getInfo();

    setInfo();
}