import { Injectable } from "@angular/core";
import { MapItem } from '../helpers/map-item';
import { Location } from '../helpers/location';
import { SVGManager } from './svg-manager.service';
import { FloorPlanComponent } from '../components/floor-plan/floor-plan.component';
import { OutdoorMapComponent } from '../components/outdoor-map/outdoor-map.component';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { SourceDestination } from '../interfaces/source-destination';
import { FloorPlanIdentifier } from '../interfaces/floor-plan-identifier';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { RouteStore } from './state-stores/route-store.service';
import { RouteCoordinator } from './route-coordinator.service';
import { FloorPlanStore } from './state-stores/floor-plan-store.service';
import { Route } from '../interfaces/route';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: MapItem = new MapItem(Location, '');
    private _outdoorIndex: number = 1;

    constructor(
        private _outdoorRouteBuilder: OutdoorRouteBuilder,
        private _svgManager: SVGManager,
        private _routeStore: RouteStore,
        private _floorPlanStore: FloorPlanStore,
        private _routeCoordinator: RouteCoordinator
        
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
            this._prepareIndoor(maps, route.destination, parsedDestination);
            
        }
        else if (typeof parsedSource != "string" && typeof parsedDestination != "string") {     // Indoor to [Outdoor to] Indoor
            /*
            * Indoor Map 1
            */
            parsedSource.id = index;
            this._prepareIndoor(maps, route.source, parsedSource);

            /*
            * Outdoor Map
            */
            this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), this._buildingPostalCode(parsedDestination.building));

            /*
            * Indoor Map 2
            */
            parsedDestination.id = ++index;
            this._prepareIndoor(maps, route.destination, parsedDestination);
        }
        else if (typeof parsedSource != "string" && typeof parsedDestination == "string") {     // Indoor to Outdoor
            /*
            * Indoor Map
            */
            parsedSource.id = index;
            this._prepareIndoor(maps, route.source, parsedSource);

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

    private async _prepareIndoor(maps: MapItem[], classID: string, parsedRoute: FloorPlanIdentifier) {
        maps.push(new MapItem(FloorPlanComponent, parsedRoute));
        // TODO: remove Location layer and simplify to reate SVGCoordinate directly
        // Setup initial SVGCoordinate 
        let initLocation: Location = new Location();
        let iSvgCoordinate: SVGCoordinate = await this._svgManager.getClassroom(this._buildingEntry(parsedRoute.building), parsedRoute.building, parsedRoute.floor); // TODO: get building entry point from config
        initLocation.setCoordinate(await iSvgCoordinate);
        // Setup final SVGCoordinate
        let finalLocation: Location = new Location();
        let fSvgCoordinate: SVGCoordinate = await this._svgManager.getClassroom(classID, parsedRoute.building, parsedRoute.floor);
        finalLocation.setCoordinate(await fSvgCoordinate);
        // activate pathfinder
        this._routeStore.storeRoute({id: parsedRoute.id, route: {source: initLocation, destination: finalLocation}});
    }
    
    // TODO: delete when routes are extracted from map-coordinator to route-coordinator
    async getRoute(iInitLocation: Location, iDestination: Location) {
        this._routeCoordinator.getIndoorRoute(iInitLocation, iDestination);
    }

    // TODO: delete when routes are extracted from map-coordinator to route-coordinator
    setVerticalTransportationMode(mode: string) {
        this._routeCoordinator.setVerticalTransportationMode(mode);
    }

    // TODO: delete when routes are extracted from map-coordinator to route-coordinator
    async nextRoute() {
        this._routeCoordinator.nextRoute();
    }

    // TODO: delete when routes are extracted from map-coordinator to route-coordinator
    hasNextRoute() {
        return this._routeCoordinator.hasNextRoute();
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

}
