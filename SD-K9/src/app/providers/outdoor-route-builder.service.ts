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
        this.directionsService.route({
            origin: formValues.sourceDestination.source,
            destination: formValues.sourceDestination.destination,
            travelMode: formValues.transport
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