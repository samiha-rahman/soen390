import { Injectable } from '@angular/core';
import { MapItem } from '../helpers/map-item';
import { SVGManager } from './svg-manager.service';
import { FloorPlanComponent } from '../components/floor-plan/floor-plan.component';
import { OutdoorMapComponent } from '../components/outdoor-map/outdoor-map.component';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { SourceDestination } from '../interfaces/source-destination';
import { FloorPlanIdentifier } from '../interfaces/floor-plan-identifier';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { RouteStore } from './state-stores/route-store.service';
import { FloorPlanStore } from './state-stores/floor-plan-store.service';
import { Route } from '../interfaces/route';
import { DirectionForm } from '../interfaces/direction-form';
import { Transport } from '../models/transport.enum.model';
import * as buildingsData from '../../local-configs/buildings.json';
import { RouteType } from '../models/route-type.enum.model';
import { VerticalTransport } from '../models/vertical-transport.enum.model';

@Injectable({
    providedIn: 'root'
})
export class MapCoordinator {
    map: MapItem;
    buildingsConfig: any = buildingsData["default"];
    private _outdoorIndex: number = 1;

    constructor(
        private _outdoorRouteBuilder: OutdoorRouteBuilder,
        private _svgManager: SVGManager,
        private _routeStore: RouteStore,
        private _floorPlanStore: FloorPlanStore,
    ) { }

    ngOnInit() { }

    public isClassroomFormat(location: string) {
        return !(location == this._parseLocation(location))
    }

    private _parseLocation(location: string): FloorPlanIdentifier | string {
        if (location && location.indexOf("-") !== -1) {
            let sliceIndex: number = location.indexOf("-");
            let floorIndex: number = sliceIndex + 1;
            switch (location.slice(0, sliceIndex).toUpperCase()) {
                case 'H': {
                    let floorPlanIdentifier: FloorPlanIdentifier = { id: 1, building: 'hall', floor: +location.substr(floorIndex, 1) };
                    return floorPlanIdentifier;
                }
                case 'CC': {
                    let floorPlanIdentifier: FloorPlanIdentifier = { id: 1, building: 'cc', floor: +location.substr(floorIndex, 1) };
                    return floorPlanIdentifier;
                }
                default: {
                    return location;
                }
            }
        }
        else {
            return location;
        }
    }

    async getOverallRoute(directionForm: DirectionForm): Promise<MapItem[]> {
        this._routeStore.clearRoutes();
        this._floorPlanStore.clearFloorPlans();
        this._outdoorRouteBuilder.clearRoute();
        let pMaps: Promise<MapItem[]> = this._parseRoute(directionForm);
        return pMaps;
    }

    private async _parseRoute(directionForm: DirectionForm) {
        let route = directionForm.sourceDestination;
        route.source = route.source.toUpperCase();
        route.destination = route.destination.toUpperCase();
        let index: number = 2;
        let verticalTransport = directionForm.verticalTransport;

        let maps: MapItem[] = [];
        let parsedSource = this._parseLocation(route.source);
        let parsedDestination = this._parseLocation(route.destination);

        if (typeof parsedSource == "string" && typeof parsedDestination == "string") {          // Outdoor to Outdoor
            this._outdoorRouteBuilder.buildRoute(directionForm)
            this._prepareOutdoor(maps, parsedSource, parsedSource, directionForm.transport);
        }
        else if (typeof parsedSource == "string" && typeof parsedDestination != "string") {     // Outdoor to Indoor
            /*
            * Outdoor map
            */
            this._prepareOutdoor(maps, route.source, this._buildingPostalCode(parsedDestination.building), directionForm.transport);

            /*
            * Indoor map
            */
            parsedDestination.id = index;
            if (parsedDestination.floor === 1) {
                this._prepareIndoorSingle(maps, parsedDestination, this._buildingEntry(parsedDestination.building), route.destination);
            } else {                                                                              /* Multi-Floor */
                index = await this._prepareIndoorMultiple(maps, this._buildingEntry(parsedDestination.building), route.destination, index, verticalTransport);
            }

        }
        else if (typeof parsedSource != "string" && typeof parsedDestination != "string") {     // Indoor to [Outdoor to] Indoor
            if (parsedSource.building === parsedDestination.building) {                              /* Same Floor */
                if (parsedSource.floor === parsedDestination.floor) {
                    this._prepareIndoorSingle(maps, parsedSource, route.source, route.destination);
                } else {                                                                              /* Multi-Floor */
                    index = await this._prepareIndoorMultiple(maps, route.source, route.destination, index, verticalTransport);
                }
            } else {
                /*
                * Indoor Map 1
                */
                parsedSource.id = index;
                if (parsedSource.floor === 1) {
                    this._prepareIndoorSingle(maps, parsedSource, route.source, this._buildingEntry(parsedSource.building));
                } else {                                                                              /* Multi-Floor */
                    index = await this._prepareIndoorMultiple(maps, route.source, this._buildingEntry(parsedSource.building), index, verticalTransport);
                }

                /*
                * Outdoor Map
                */
                this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), this._buildingPostalCode(parsedDestination.building), directionForm.transport);

                /*
                * Indoor Map 2
                */
                parsedDestination.id = ++index;
                if (parsedDestination.floor === 1) {
                    this._prepareIndoorSingle(maps, parsedDestination, this._buildingEntry(parsedDestination.building), route.destination);
                } else {                                                                              /* Multi-Floor */
                    index = await this._prepareIndoorMultiple(maps, this._buildingEntry(parsedDestination.building), route.destination, index, verticalTransport);
                }
            }
        }
        else if (typeof parsedSource != "string" && typeof parsedDestination == "string") {     // Indoor to Outdoor
            /*
            * Indoor Map
            */
            parsedSource.id = index;
            if (parsedSource.floor === 1) {
                this._prepareIndoorSingle(maps, parsedSource, route.source, this._buildingEntry(parsedSource.building));
            } else {                                                                              /* Multi-Floor */
                index = await this._prepareIndoorMultiple(maps, route.source, this._buildingEntry(parsedSource.building), index, verticalTransport);
            }

            /*
            * Outdoor map
            */
            this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), route.destination, directionForm.transport);
        }
        return maps;
    }

    private _prepareOutdoor(maps: MapItem[], startPlace: string, endPlace: string, transport: Transport) {
        maps.push(new MapItem(OutdoorMapComponent, { id: this._outdoorIndex }));

        let sourceDestination: SourceDestination = { source: startPlace, destination: endPlace };
        let route: Route = { id: this._outdoorIndex, route: { sourceDestination: sourceDestination, transport: transport }, type: RouteType.OUTDOOR };
        this._routeStore.storeRoute(route);

        // this._outdoorRouteBuilder.buildRoute({sourceDestination: sourceDestination, transport: transport});
    }
    // this._buildingEntry(parsedRoute.building)

    private async _prepareIndoorMultiple(
        maps: MapItem[], startID: string, endID: string, index: number, verticalTransport: VerticalTransport
    ) {
        let parsedSource = this._parseLocation(startID);
        let parsedDestination = this._parseLocation(endID);
        let difference: number = 0;
        let currentTransport: string;
        let previousTransport: string;
        if (typeof parsedSource != "string" && typeof parsedDestination != "string") {

            difference = parsedDestination.floor - parsedSource.floor;

            if (difference >= 0) {
                currentTransport = await this._getNearestTransport(
                    verticalTransport,
                    'up',
                    parsedSource.building,
                    parsedSource.floor,
                    startID
                );
                parsedSource.id = index;
                this._prepareIndoorSingle(maps, parsedSource, startID, currentTransport);

                let nextFloor: number = parsedSource.floor + 1;
                let beforeDestFloor: number = parsedDestination.floor - 1;
                for (let _floor = nextFloor; _floor <= beforeDestFloor; _floor++) {
                    if (_floor === 1 || _floor === 2 || _floor === 6 || _floor === 8) {
                        previousTransport = currentTransport;
                        currentTransport = await this._getNearestTransport(
                            verticalTransport,
                            'up',
                            parsedSource.building,
                            _floor,
                            previousTransport
                        );
                        if (previousTransport !== currentTransport) {
                            this._prepareIndoorSingle(maps, { id: ++index, building: parsedSource.building, floor: _floor },
                                previousTransport, currentTransport);
                        }
                    }
                }
            } else {
                currentTransport = await this._getNearestTransport(
                    verticalTransport,
                    'down',
                    parsedSource.building,
                    parsedSource.floor,
                    startID
                );
                parsedSource.id = index;
                this._prepareIndoorSingle(maps, parsedSource, startID, currentTransport);

                let nextFloor: number = parsedSource.floor - 1;
                let beforeDestFloor: number = parsedDestination.floor + 1;
                for (let _floor = nextFloor; _floor >= beforeDestFloor; _floor--) {
                    if (_floor === 1 || _floor === 2 || _floor === 6 || _floor === 8) {
                        previousTransport = currentTransport;
                        currentTransport = await this._getNearestTransport(
                            verticalTransport,
                            'down',
                            parsedSource.building,
                            _floor,
                            previousTransport
                        );
                        if (previousTransport !== currentTransport) {
                            this._prepareIndoorSingle(maps, { id: ++index, building: parsedSource.building, floor: _floor },
                                previousTransport, currentTransport);
                        }
                    }
                }
            }

            parsedDestination.id = ++index;
            this._prepareIndoorSingle(maps, parsedDestination, currentTransport, endID);
        }

        return index;
    }

    private async _prepareIndoorSingle(maps: MapItem[], parsedRoute: FloorPlanIdentifier, startID?: string, endID?: string) {
        maps.push(new MapItem(FloorPlanComponent, parsedRoute));

        if (startID && endID) {
            // Setup initial SVGCoordinate
            let iSvgCoordinate: SVGCoordinate = await this._svgManager.getSVGCoordFromID(endID, parsedRoute.building, parsedRoute.floor);
            // TODO: get building entry point from config
            // Setup final SVGCoordinate
            let fSvgCoordinate: SVGCoordinate = await this._svgManager.getSVGCoordFromID(startID, parsedRoute.building, parsedRoute.floor);
            // activate pathfinder
            this._routeStore.storeRoute({ id: parsedRoute.id, route: { source: iSvgCoordinate, destination: fSvgCoordinate }, type: RouteType.INDOOR });
        }
    }

    private async _getNearestTransport(
        mode: VerticalTransport,
        direction: string,
        building: string,
        floor: number,
        locationID: string) {
        let svgCoordinates;
        svgCoordinates = await this._svgManager.getSVGCoordFromID(locationID, building, floor);
        return await this._svgManager.getClosestVerticalTransportationId(mode, direction, svgCoordinates);
    }

    // TODO: replace with config
    private _buildingPostalCode(building: string): string {
        switch (building) {
            case 'hall':
                return "h3g1m8";
            case 'cc':
                return "h4b1r6";
        }
    }

    private _buildingEntry(building: string): string {
        return this.buildingsConfig[building]["buildingEntry"];
    }
    // Temp: to test for indoor in H only!!!
    private _floorEntry(building: string, floor: number): string {
        return this.buildingsConfig[building]["floorsEntry"][floor];
    }

}
