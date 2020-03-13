import { Injectable } from "@angular/core";
import { MapItem } from '../helpers/map-item';
import { Location } from '../helpers/location';
import { RouteNavigator } from '../helpers/route-navigator';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { SVGManager } from './svg-manager.service';
import { FloorPlanComponent } from '../components/floor-plan/floor-plan.component';
import { OutdoorMapComponent } from '../components/outdoor-map/outdoor-map.component';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { SourceDestination } from '../interfaces/source-destination';
import { FloorPlanIdentifier } from '../interfaces/floor-plan-identifier';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { RouteStore } from './state-stores/route-store.service';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: MapItem = new MapItem(Location, '');
    private _initLocation: Location;
    private _finalLocation: Location;
    private _verticalTransportationMode = 'escalators';
    private _hasNextRoute: boolean = false;
    private _routeLocationList = [];

    constructor(
        private _indoorRouteBuilder: IndoorRouteBuilder,
        private _outdoorRouteBuilder: OutdoorRouteBuilder,
        private _svgManager: SVGManager,
        private _routeStore: RouteStore
    ) {}

    ngOnInit() {
        this._initLocation = new Location();
        this._finalLocation = new Location();
    }
    
    // Refactor code once google maps is integrated
    getMap(initialLocation?: string) : MapItem {
        let parsedLocation = this._parseLocation(initialLocation);

        if (parsedLocation == 'hall') {
            return new MapItem(FloorPlanComponent, {floor: 8, building: 'hall'});
        }
        else if (parsedLocation == 'loyola') {
            return new MapItem(FloorPlanComponent, {floor: 1, building: 'loyola'});
        }
        else if (!parsedLocation) {
            return new MapItem(OutdoorMapComponent, {id: 1});
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
                    let floorPlanIdentifier: FloorPlanIdentifier = {building: 'hall', floor: +location.substr(2,1)};
                    return floorPlanIdentifier;
                }
                case 'L': {
                    let floorPlanIdentifier: FloorPlanIdentifier = {building: 'loyola', floor: +location.substr(2,1)};
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
        let pMaps: Promise<MapItem[]> = this._parseRoute(route);
        return pMaps;
    }

    private async _parseRoute(route: SourceDestination) {
        let maps: MapItem[] = [];
        let parsedSource = this._parseLocation(route.source);
        let parsedDestination = this._parseLocation(route.destination);

        if (typeof parsedSource == "string" && typeof parsedDestination == "string") {
            this._outdoorRouteBuilder.buildRoute(route)
        }
        else if (typeof parsedSource == "string" && typeof parsedDestination != "string") {
            /* 
            * Outdoor map
            */
            maps.push(new MapItem(OutdoorMapComponent, {id: 1}));
            let route_1: SourceDestination = {source: route.source, destination: this._buildingPostalCode(parsedDestination.building)}
            this._outdoorRouteBuilder.buildRoute(route_1);

            /*
            * Indoor map 
            */
            maps.push(new MapItem(FloorPlanComponent, parsedDestination));
            // TODO: remove Location layer and simplify to reate SVGCoordinate directly
            // Setup initial SVGCoordinate 
            let initLocation: Location = new Location();
            let iSvgCoordinate: SVGCoordinate = await this._svgManager.getClassroom('H-806', parsedDestination.building, parsedDestination.floor); // TODO: get building entry point from config
            initLocation.setCoordinate(await iSvgCoordinate);
            // Setup final SVGCoordinate
            let finalLocation: Location = new Location();
            let fSvgCoordinate: SVGCoordinate = await this._svgManager.getClassroom(route.destination, parsedDestination.building, parsedDestination.floor);
            finalLocation.setCoordinate(await fSvgCoordinate);
            // activate pathfinder
            this._routeStore.storeRoute({id: 2, route: {source: initLocation, destination: finalLocation}});  // TODO: refactor, find better place to store indoor route
            // this.getRoute(initLocation, finalLocation);
            
        }
        return maps;
    }
    
    // Refactor code
    // TODO: implement the proper code to accomodate a combination of indoor and outdoor routes
    async getRoute(iInitLocation: Location, iDestination: Location) {
        this._initLocation = iInitLocation;
        this._finalLocation = iDestination;
        this._routeLocationList = [];

        // TODO: check if SVGCoordinate of GoogleCoordinate
        if (this._initLocation.getCoordinate().id && this._finalLocation.getCoordinate().id) {
            if (this._initLocation.getCoordinate().building === this._finalLocation.getCoordinate().building &&
                this._initLocation.getCoordinate().floor === this._finalLocation.getCoordinate().floor) {
                    // if same building and same floor
                let hallRouteNavigator: RouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
                hallRouteNavigator.getRoute(this._initLocation, this._finalLocation);
                this._hasNextRoute = false;
            } else { // else different floor
                await this.generateRouteLocations(this._initLocation, this._finalLocation);
                this.nextRoute();
            }
        }
    }

    routeLocation(fromL: Location, toL: Location) {
        return(
            {
                from: fromL,
                to: toL
            }
        );
    }

    async generateRouteLocations(initLocation: Location, finalLocation: Location) {
        const firstvTransportation = new Location();
        const secondvTransportation = new Location();
        let direction;
        if (initLocation.getCoordinate().building === finalLocation.getCoordinate().building){
            if (initLocation.getCoordinate().floor < finalLocation.getCoordinate().floor) {
                direction = 'up';
            } else {
                direction = 'down';
            }
            const vTransportationId = await this._svgManager.getClosestVerticalTransportationId(this._verticalTransportationMode, direction,
                finalLocation.getCoordinate().building,
                finalLocation.getCoordinate().floor,
                finalLocation);
            firstvTransportation.setCoordinate(await this._svgManager.getVerticalTransportation(
                vTransportationId,
                this._verticalTransportationMode,
                initLocation.getCoordinate().building,
                initLocation.getCoordinate().floor));
            this._routeLocationList.push(this.routeLocation(initLocation, firstvTransportation));
            secondvTransportation.setCoordinate(await this._svgManager.getVerticalTransportation(
                vTransportationId,
                this._verticalTransportationMode,
                finalLocation.getCoordinate().building,
                finalLocation.getCoordinate().floor));
            this._routeLocationList.push(this.routeLocation(secondvTransportation, finalLocation));
        }
        this._hasNextRoute = true;
    }

    setVerticalTransportationMode(mode: string) {
        this._verticalTransportationMode = mode;
    }

    async nextRoute() {
        const routeNavigator: RouteNavigator = new RouteNavigator(this._indoorRouteBuilder);
        routeNavigator.getRoute(this._routeLocationList[0].from, this._routeLocationList[0].to);
        this._routeLocationList.shift();
        if (this._routeLocationList.length === 0) {
            this._hasNextRoute = false;
        }
    }

    hasNextRoute() {
        return this._hasNextRoute;
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

}
