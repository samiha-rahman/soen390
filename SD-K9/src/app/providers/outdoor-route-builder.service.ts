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
    transportation(transportation: any) {
      throw new Error("Method not implemented.");
    }
    //Google direction service
    map: any;
    directionsService: any;
    directionsDisplay: any;
    waypts: any[] = [];
    transportWay: any;

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

    shuttleService(formValues: DirectionForm){
        //TODO: Refactor the code
        //Shuttles coordinates
        let loyShuttle = "45.458424,-73.638369";
        let hallShuttle = "45.497163,-73.578535";
        
        //From hall to loyola
        if(formValues.transport == "SHUTTLE" && formValues.sourceDestination.source == "45.497304, -73.578326"){
            this.transportWay = "DRIVING"; //When shuttle is chosen, display DRIVING route
            this.waypts = [
                {location: hallShuttle, stopover: true},
                {location: loyShuttle, stopover: true}
            ];
        }//From loyola to hall
        else if (formValues.transport == "SHUTTLE" && formValues.sourceDestination.source == "h4b1r6"){
            this.transportWay = "DRIVING";
            this.waypts = [
                {location: loyShuttle, stopover: true}
            ];
        }else if(formValues.transport == "SHUTTLE"){
            this.waypts = null;
            this.transportWay = "TRANSIT"; 
        }else{
            this.waypts = null;
            this.transportWay = formValues.transport;
        }
    }

    buildRoute(formValues: DirectionForm) {
        // TODO: Fix the overlaying directions (if i change travelMode it keeps the old one)
        this.shuttleService(formValues);
        this.directionsService.route({
            origin: formValues.sourceDestination.source,
            destination: formValues.sourceDestination.destination,
            waypoints: this.waypts,
            travelMode: this.transportWay
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