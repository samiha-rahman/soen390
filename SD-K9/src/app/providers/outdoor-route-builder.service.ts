import { Injectable } from "@angular/core";
import { RouteBuilder } from "../interfaces/route-builder";
import { Location } from '../helpers/location';
import { GoogleStore } from './state-stores/google-store.service';
import { RouteStore } from './state-stores/route-store.service';
import { Route } from '../interfaces/route';
import { UnsubscribeCallback } from '../interfaces/unsubscribe-callback';
import { SourceDestination } from '../interfaces/source-destination';

declare var google;

@Injectable()
export class OutdoorRouteBuilder {
      //Google direction service
    map: any;  
    directionsService: any;
    directionsDisplay: any;
    transportMode: String = "DRIVING"; //Default travel mode

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

    buildRoute(formValues: SourceDestination) {
        if (!this._googleStore.getGoogleMapState().route) {
            this._addRouteState(formValues);
        }
        this._calculateAndDisplayRoute(formValues);
    }

    private _addRouteState(formValues: SourceDestination) {
        let sourceDestination: SourceDestination = {source: formValues.source, destination: formValues.destination};
        let route: Route = {id: this._googleStore.getGoogleMapState().id, route: sourceDestination};
        this._googleStore.setRoute(route);
        this._routeStore.storeRoute(route);
    }

    //Calculate shortest path for outdoor map
    private _calculateAndDisplayRoute(formValues: SourceDestination) {
        this.directionsService.route({
            origin: formValues.source,
            destination: formValues.destination,
            travelMode: this.transportMode
        }, (response, status) => {
            if (status === 'OK') {
            this.directionsDisplay.setDirections(response);
            } else {
            window.alert('Directions request failed due to ' + status);
            }
        });
        this.directionsDisplay.setMap(this.map);
    }

    //Travel mode selected
    mode(event){
        if(event.detail.value == "DRIVING"){
            this.transportMode = "DRIVING"
        }else if(event.detail.value == "WALKING"){
            this.transportMode = "WALKING"
        }else if(event.detail.value == "BICYCLING"){
            this.transportMode = "BYCYCLING"
        }else if(event.detail.value == "TRANSIT"){
            this.transportMode = "TRANSIT"
        }
        return this.transportMode;
    }
}