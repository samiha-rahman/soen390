import { Injectable } from "@angular/core";
import { MapItem } from '../helpers/map-item';
import { SVGManager } from './svg-manager.service';
import { FloorPlanComponent } from '../components/floor-plan/floor-plan.component';
import { OutdoorMapComponent } from '../components/outdoor-map/outdoor-map.component';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { SourceDestination } from '../interfaces/source-destination';
import { FloorPlanIdentifier } from '../interfaces/floor-plan-identifier';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { RouteStore } from './state-stores/route-store.service';
import { IndoorRouteCoordinator } from './indoor-route-coordinator.service';
import { FloorPlanStore } from './state-stores/floor-plan-store.service';
import { Route } from '../interfaces/route';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: MapItem;
    private _outdoorIndex: number = 1;

    constructor(
        private _outdoorRouteBuilder: OutdoorRouteBuilder,
        private _svgManager: SVGManager,
        private _routeStore: RouteStore,
        private _floorPlanStore: FloorPlanStore,
    ) {}

    ngOnInit() {}
    
    // Refactor code once google maps is integrated
    getMap(initialLocation?: string) : MapItem {
        let parsedLocation = this._parseLocation(initialLocation);

        if (parsedLocation == 'hall') {
            return new MapItem(FloorPlanComponent, {id: 1, floor: 8, building: 'hall'});
        }
        else if (parsedLocation == 'loyola') {
            return new MapItem(FloorPlanComponent, {id: 1, floor: 1, building: 'loyola'});
        }
        else if (!parsedLocation) {
            return new MapItem(OutdoorMapComponent, {id: this._outdoorIndex});
        }
        else {
            let data: any = parsedLocation.valueOf();       // TODO: Give this a type (depends on return type of _parseLocation()) 
            return new MapItem(FloorPlanComponent, {floor: data.floor, building: data.buildng });
        }
    }

    private _parseLocation(location: string): FloorPlanIdentifier | string {
        if (location && location.substr(1,1) === '-') {
            switch (location.substr(0,1)) {
                case 'H': {
                    let floorPlanIdentifier: FloorPlanIdentifier = {id: 1, building: 'hall', floor: +location.substr(2,1)};
                    return floorPlanIdentifier;
                }
                case 'L': {
                    let floorPlanIdentifier: FloorPlanIdentifier = {id: 1, building: 'loyola', floor: +location.substr(2,1)};
                    return floorPlanIdentifier;
                }
            }
        }
        else {
            return location;
        }
    }

    // remove eventually
    async getOverallRoute(route: SourceDestination): Promise<MapItem[]> {
        this._routeStore.clearRoutes();
        this._floorPlanStore.clearFloorPlans();
        this._outdoorRouteBuilder.clearRoute();
        let pMaps: Promise<MapItem[]> = this._parseRoute(route);
        return pMaps;
    }

    private async _parseRoute(route: SourceDestination) {
        route.source = route.source.toUpperCase();
        route.destination = route.destination.toUpperCase();
        let index: number = 2;

        let maps: MapItem[] = [];
        let parsedSource = this._parseLocation(route.source);
        let parsedDestination = this._parseLocation(route.destination);

        if (typeof parsedSource == "string" && typeof parsedDestination == "string") {          // Outdoor to Outdoor
            this._outdoorRouteBuilder.buildRoute(route)
        }
        else if (typeof parsedSource == "string" && typeof parsedDestination != "string") {     // Outdoor to Indoor
            /* 
            * Outdoor map
            */
            this._prepareOutdoor(maps, route.source, this._buildingPostalCode(parsedDestination.building));

            /*
            * Indoor map 
            */
            parsedDestination.id = index;
            this._prepareIndoor(maps, parsedDestination, route.destination, this._buildingEntry(parsedDestination.building));
            
        }
        else if (typeof parsedSource != "string" && typeof parsedDestination != "string") {     // Indoor to [Outdoor to] Indoor
            if(parsedSource.building === parsedDestination.building) {                              /* Same Floor */
                if(parsedSource.floor === parsedDestination.floor) {
                    this._prepareIndoor(maps, parsedSource, route.source, route.destination);
                }
                else {                                                                              /* Multi-Floor */
                    let difference = parsedDestination.floor - parsedSource.floor;
                    let currentTransport: string;
                    let previousTransport: string;

                    if (difference >= 0) {
                        currentTransport = await this._getNearestTransport(
                            this.mode(),
                            'up',
                            parsedSource.building,
                            parsedSource.floor,
                            route.source,
                            true
                        );
                        this._prepareIndoor(maps, parsedSource, route.source, currentTransport);

                        let nextFloor: number = parsedSource.floor + 1;
                        let beforeDestFloor: number = parsedDestination.floor - 1;
                        for (let _floor = nextFloor; _floor <= beforeDestFloor; _floor++) {
                            if (_floor === 1 || _floor === 2 || _floor === 6 || _floor === 8) {
                                previousTransport = currentTransport;
                                currentTransport = await this._getNearestTransport(
                                    this.mode(),
                                    'up',
                                    parsedSource.building,
                                    _floor,
                                    previousTransport,
                                    false
                                );
                                if (previousTransport !== currentTransport) {
                                    this._prepareIndoor(maps, {id: ++index, building: parsedSource.building, floor: _floor},
                                        previousTransport, currentTransport);
                                    // TODO: show path inside vertical transportation
                                }
                            }
                        }
                    } else {
                        currentTransport = await this._getNearestTransport(
                            this.mode(),
                            'down',
                            parsedSource.building,
                            parsedSource.floor,
                            route.source,
                            true
                        );
                        this._prepareIndoor(maps, parsedSource, route.source, currentTransport);

                        let nextFloor: number = parsedSource.floor - 1;
                        let beforeDestFloor: number = parsedDestination.floor + 1;
                        for (let _floor = nextFloor; _floor >= beforeDestFloor; _floor--) {
                            if (_floor === 1 || _floor === 2 || _floor === 6 || _floor === 8) {
                                previousTransport = currentTransport;
                                currentTransport = await this._getNearestTransport(
                                    this.mode(),
                                    'down',
                                    parsedSource.building,
                                    _floor,
                                    previousTransport,
                                    false
                                );
                                if (previousTransport !== currentTransport) {
                                    this._prepareIndoor(maps, {id: ++index, building: parsedSource.building, floor: _floor},
                                        previousTransport, currentTransport);
                                    // TODO: show path inside vertical transportation
                                }
                            }
                        }
                    }

                    parsedDestination.id = ++index;
                    this._prepareIndoor(maps, parsedDestination, currentTransport, route.destination);
                }
            } else {
                /*
                * Indoor Map 1
                */
                parsedSource.id = index;
                this._prepareIndoor(maps, parsedSource, route.source, this._buildingEntry(parsedSource.building));
    
                /*
                * Outdoor Map
                */
                this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), this._buildingPostalCode(parsedDestination.building));
    
                /*
                * Indoor Map 2
                */
                parsedDestination.id = ++index;
                this._prepareIndoor(maps,parsedDestination, route.destination, this._buildingEntry(parsedDestination.building));
            }
        }
        else if (typeof parsedSource != "string" && typeof parsedDestination == "string") {     // Indoor to Outdoor
            /*
            * Indoor Map
            */
            parsedSource.id = index;
            this._prepareIndoor(maps, parsedSource, route.source, this._buildingEntry(parsedSource.building));

            /* 
            * Outdoor map
            */
            this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), route.destination);
        }
        return maps;
    }

    private _prepareOutdoor(maps: MapItem[], startPlace: string, endPlace: string) {
        maps.push(new MapItem(OutdoorMapComponent, {id: this._outdoorIndex}));

        let sourceDestination: SourceDestination = {source: startPlace, destination: endPlace};
        let route: Route = {id: this._outdoorIndex, route: sourceDestination};
        this._routeStore.storeRoute(route);

        this._outdoorRouteBuilder.buildRoute(sourceDestination);
    }
    // this._buildingEntry(parsedRoute.building)

    private async _prepareIndoor(maps: MapItem[], parsedRoute: FloorPlanIdentifier, startID?: string, endID?: string) {
        maps.push(new MapItem(FloorPlanComponent, parsedRoute));

        console.log(startID + ' to ' + endID);
        if (startID && endID) {
            // Setup initial SVGCoordinate
            let iSvgCoordinate: SVGCoordinate = await this._svgManager.getSVGCoordFromID(endID, parsedRoute.building, parsedRoute.floor);
            // TODO: get building entry point from config
            // Setup final SVGCoordinate
            let fSvgCoordinate: SVGCoordinate = await this._svgManager.getSVGCoordFromID(startID, parsedRoute.building, parsedRoute.floor);
            // activate pathfinder
            this._routeStore.storeRoute({id: parsedRoute.id, route: {source: iSvgCoordinate, destination: fSvgCoordinate}});
        }
    }

    private async _getNearestTransport(
        mode: string,
        direction: string,
        building: string,
        floor: number,
        locationID: string,
        isClassroom: boolean = true) {
        let svgCoordinates;
        // if (isClassroom) {
            // svgCoordinates = await this._svgManager.getSVGCoordFromID(locationID, building, floor);
        // } else {
        svgCoordinates = await this._svgManager.getSVGCoordFromID(locationID, building, floor);
        // }
        const transportationID  = await this._svgManager.getClosestVerticalTransportationId(mode, direction, svgCoordinates);
        return transportationID;
    }

    private mode() {
        return 'escalators';
    }

    // TODO: replace with config
    private _buildingPostalCode(building: string): string {
        switch (building) {
            case 'hall':
                return "h3g1m8";
            case 'loyola':
                return "h4b1r6";
        }
    }

    // TODO: replace with config
    private _buildingEntry(building: string): string {
        switch (building) {
            case 'hall':
                return "H-806";
            case 'loyola':
                return "L-101";
        }
    }
    // Temp: to test for indoor in H only!!!
    private _floorEntry(floor: number): string {
        switch(floor) {
            case 6:
                return "H-606";
            case 8:
                return "H-806";
        }
    }

}
