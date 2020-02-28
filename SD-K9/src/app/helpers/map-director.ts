import { MapBuilder } from '../interfaces/map-builder';
import { Map } from '../interfaces/map';
import { ConcordiaCampus } from '../interfaces/concordia-campus';

export class MapDirector {
    constructor(){}

    makeIndoorMap(iMapBuilder: MapBuilder, iConcordiaCampus: ConcordiaCampus) : Map {
        // iMapBuilder.setLocation();
        // iMapBuilder.setPOI();
        iMapBuilder.setBuilding(iConcordiaCampus);
        let map: Map = iMapBuilder.buildMap();
        console.log(map);

        return map;
    }

    makeOutdoorMap(iMapBuilder: MapBuilder) : Map {
        let map: Map = iMapBuilder.buildMap();
        return map;
    }
}