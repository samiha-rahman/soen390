import { Injectable } from '@angular/core';
import { MapBuilder } from '../interfaces/map-builder';
import { Map } from '../interfaces/map';
import { IndoorMapData } from '../data-models/indoor-map-data';
import { OutdoorMapData } from '../data-models/outdoor-map-data';
import { ConcordiaCampus } from '../data-models/concordia-campus-data';

@Injectable()
export class MapDirector {
    constructor(){}

    makeIndoorMap(iMapBuilder: MapBuilder) : Map {
        // iMapBuilder.setLocation();
        // iMapBuilder.setPOI();
        // iMapBuilder.setBuilding(iConcordiaCampus: ConcordiaCampus);
        let map: Map = iMapBuilder.buildMap();
        console.log(map);
        return map;
    }

    makeOutdoorMap(iMapBuilder: MapBuilder) : Map {
        let map: Map = iMapBuilder.buildMap();
        return map;
    }
}