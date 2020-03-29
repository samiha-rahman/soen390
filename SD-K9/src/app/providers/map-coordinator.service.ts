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
import { FloorPlanStore } from './state-stores/floor-plan-store.service';
import { Route } from '../interfaces/route';
import { DirectionForm } from '../interfaces/direction-form';
import { Transport } from '../models/transport.enum.model';
import * as buildingsData from '../../local-configs/buildings.json';

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

    private _parseLocation(location: string): FloorPlanIdentifier | string {
        if (location && location.indexOf("-") !== -1) {
            let sliceIndex: number = location.indexOf("-");
            let floorIndex: number = sliceIndex + 1;
            switch (location.slice(0, sliceIndex)) {
                case 'H': {
                    let floorPlanIdentifier: FloorPlanIdentifier = { id: 1, building: 'hall', floor: +location.substr(floorIndex, 1) };
                    return floorPlanIdentifier;
                }
                case 'CC': {
                    let floorPlanIdentifier: FloorPlanIdentifier = { id: 1, building: 'cc', floor: +location.substr(floorIndex, 1) };
                    return floorPlanIdentifier;
                }
            }
        }
        else {
            return location;
        }
    }

    // remove eventually
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

        let maps: MapItem[] = [];
        let parsedSource = this._parseLocation(route.source);
        let parsedDestination = this._parseLocation(route.destination);

        if (typeof parsedSource == "string" && typeof parsedDestination == "string") {          // Outdoor to Outdoor
            this._outdoorRouteBuilder.buildRoute(directionForm)
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
            this._prepareIndoor(maps, parsedDestination, route.destination, this._buildingEntry(parsedDestination.building));

        }
        else if (typeof parsedSource != "string" && typeof parsedDestination != "string") {     // Indoor to [Outdoor to] Indoor
            if (parsedSource.building === parsedDestination.building) {                              /* Same Floor */
                if (parsedSource.floor === parsedDestination.floor) {
                    this._prepareIndoor(maps, parsedSource, route.source, route.destination);
                }
                else {                                                                              /* Multi-Floor */
                    let difference = parsedDestination.floor - parsedSource.floor;

                    this._prepareIndoor(maps, parsedSource, route.source, this._floorEntry(parsedSource.building, parsedSource.floor));

                    // TODO: uncomment this with Joanna's changes
                    // if (difference >= 0) {
                    //     let nextFloor: number = parsedSource.floor + 1;
                    //     let beforeDestFloor: number = parsedDestination.floor - 1;
                    //     for (var _floor = nextFloor; _floor <= beforeDestFloor; _floor++) {
                    //         this._prepareIndoor(maps, { id: ++index, building: parsedSource.building, floor: _floor }); // TODO: show path inside vertical transportation
                    //     }
                    // }
                    // else {
                    //     let nextFloor: number = parsedSource.floor - 1;
                    //     let beforeDestFloor: number = parsedDestination.floor + 1;
                    //     for (var _floor = nextFloor; _floor >= beforeDestFloor; _floor--) {
                    //         this._prepareIndoor(maps, { id: ++index, building: parsedSource.building, floor: _floor }); // TODO: show path inside vertical transportation
                    //     }
                    // }

                    parsedDestination.id = ++index;
                    this._prepareIndoor(maps, parsedDestination, route.destination, this._floorEntry(parsedDestination.building, parsedDestination.floor));
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
                this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), this._buildingPostalCode(parsedDestination.building), directionForm.transport);

                /*
                * Indoor Map 2
                */
                parsedDestination.id = ++index;
                this._prepareIndoor(maps, parsedDestination, route.destination, this._buildingEntry(parsedDestination.building));
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
            this._prepareOutdoor(maps, this._buildingPostalCode(parsedSource.building), route.destination, directionForm.transport);
        }
        return maps;
    }

    private _prepareOutdoor(maps: MapItem[], startPlace: string, endPlace: string, transport: Transport) {
        maps.push(new MapItem(OutdoorMapComponent, { id: this._outdoorIndex }));

        let sourceDestination: SourceDestination = { source: startPlace, destination: endPlace };
        let route: Route = { id: this._outdoorIndex, route: { sourceDestination: sourceDestination, transport: transport } };
        this._routeStore.storeRoute(route);

        // this._outdoorRouteBuilder.buildRoute({sourceDestination: sourceDestination, transport: transport});
    }
    // this._buildingEntry(parsedRoute.building)

    private async _prepareIndoor(maps: MapItem[], parsedRoute: FloorPlanIdentifier, classID?: string, entryID?: string) {
        maps.push(new MapItem(FloorPlanComponent, parsedRoute));

        if (classID && entryID) {
            // Setup initial SVGCoordinate
            let iSvgCoordinate: SVGCoordinate = await this._svgManager.getClassroom(entryID, parsedRoute.building, parsedRoute.floor); // TODO: get building entry point from config
            // Setup final SVGCoordinate
            let fSvgCoordinate: SVGCoordinate = await this._svgManager.getClassroom(classID, parsedRoute.building, parsedRoute.floor);
            // activate pathfinder
            this._routeStore.storeRoute({ id: parsedRoute.id, route: { source: iSvgCoordinate, destination: fSvgCoordinate } });
        }
    }

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
