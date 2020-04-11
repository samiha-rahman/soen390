import { Injectable } from "@angular/core";
import { GoogleStore } from './state-stores/google-store.service';
import { RouteStore } from './state-stores/route-store.service';
import { Route } from '../interfaces/route';
import { UnsubscribeCallback } from '../interfaces/unsubscribe-callback';
import { SourceDestination } from '../interfaces/source-destination';
import { DirectionForm } from '../interfaces/direction-form';

declare var google;

@Injectable()
export class OutdoorRouteBuilder {
    //Google direction service
    map: any;
    directionsService: any;
    directionsDisplay: any;

    private _unsubscribe: UnsubscribeCallback;

    constructor(
        private _googleStore: GoogleStore,
        private _routeStore: RouteStore
    ) {
        this._unsubscribe = this._googleStore.subscribe(() => {
            this.map = this._googleStore.getGoogleMapState().map;
            google = this._googleStore.getGoogleMapState().google;

            this.directionsService = new google.maps.DirectionsService;
            this.directionsDisplay = new google.maps.DirectionsRenderer;
        });
    }

    buildRoute(formValues: DirectionForm) {
        //TODO: Refactor the code
        let loyShuttle = "45.458424,-73.638369";
        let hallShuttle = "45.497163,-73.578535";
        let waypts: any[] = [];
        let transportation: any;
        if(formValues.transport == "SHUTTLE" && formValues.sourceDestination.source == "45.497304, -73.578326"){
            transportation = "DRIVING";
            waypts = [
                {location: hallShuttle, stopover: true},
                {location: loyShuttle, stopover: true}
            ];
        }else if (formValues.transport == "SHUTTLE" && formValues.sourceDestination.source == "h4b1r6"){
            transportation = "DRIVING";
            waypts = [
                {location: loyShuttle, stopover: true}
            ];
        }else if(formValues.transport == "SHUTTLE"){
            waypts = null;
            transportation = "TRANSIT"; 
        }else{
            waypts = null;
            transportation = formValues.transport;
        }
        // TODO: Fix the overlaying directions (if i change travelMode it keeps the old one)
        this.directionsService.route({
            origin: formValues.sourceDestination.source,
            destination: formValues.sourceDestination.destination,
            waypoints: waypts,
            travelMode: transportation
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        this.directionsDisplay.setMap(this.map);
    }

    clearRoute() {
        this._googleStore.removeRoute();
    }
}