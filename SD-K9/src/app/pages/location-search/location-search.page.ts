import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DirectionFormStore } from '../../providers/state-stores/direction-form-store.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleStore } from 'src/app/providers/state-stores/google-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';

declare var google;

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.page.html',
  styleUrls: ['./location-search.page.scss'],
})
export class LocationSearchPage implements OnInit {

  // @ViewChild(IonSearchbar) searchbar: IonSearchbar;

  query: string;
  itemList: string[];

  currentMapState: any;
  latlng: any;
  marker: any;
  coder: any;

  private _itemList: string[];
  private _queryType: string;
  private _unsubscribe: UnsubscribeCallback;
  private _googleAutocomplete: any;

  public currentQuery: string;
  public placesSearchResults = new Array<any>();

  constructor(
    private _navController: NavController,
    private _activatedRoute: ActivatedRoute,
    private _directionFormStore: DirectionFormStore,
    private _googleStore: GoogleStore
  ) {
    this._activatedRoute.queryParams.subscribe(params => {
      this._queryType = params['query'];
    });
    this._unsubscribe = this._googleStore.subscribe(() => {
      google = this._googleStore.getGoogleMapState().google;
    });
  }

  ngOnInit() {
    // setTimeout(() => { this.searchbar.setFocus(); }, 150);
    // TODO: get from config once available
    this._itemList = ['H-811', 'H-815', 'H-817', 'H-819', 'H-821', 'CC-101', 'H-617'];
  }

  goToHomePage() {
    this._navController.navigateBack("home");
  }

  changeQuery() {
    if (!this.query.trim().length) {
      return;
    };

    this.itemList = [];
    this._googleAutocomplete = new google.maps.places.AutocompleteService();
    this._googleAutocomplete.getPlacePredictions({ input: this.query }, predictions => {
      console.log(predictions)
      this.placesSearchResults = predictions;
    });

    for (const item of this._itemList) {
      if (item.toUpperCase().includes(this.query.toUpperCase())) {
        this.itemList.push(item);
      }
    }
  }

  enterQuery(query: string) {
    switch (this._queryType) {
      case 'start': {
        this._directionFormStore.setSource(query);
        break;
      }
      case 'final': {
        this._directionFormStore.setDestination(query);
        break;
      }
    }
    this._navController.navigateBack("home");
  }

  getCurrentPos(){
    this.currentMapState = this._googleStore.getGoogleMapState();
    let currentPos = this.currentMapState.currentpos;
    let self = this;
    this.latlng = {lat: currentPos.lat(), lng:  currentPos.lng()};
    this.coder = this.currentMapState.geocoder; 

    self.enterQuery(' '); 
    this.coder.geocode({'location': this.latlng}, function(results, status) 
    {
      if(status === "OK"){
        self.enterQuery(results[0].formatted_address);
      } else{
        console.error( 'Geocode was not successful for the following reason: ' + status );
      }
    });
  }
  //TODO: for future implementation, move this function to OutDoor-Map Component
  //      because manipulation of the map should be done there.
  moveMap(query: string){
    this.currentMapState = this._googleStore.getGoogleMapState();
    let map = this.currentMapState.map;
    this.coder = this.currentMapState.geocoder;

    this.coder.geocode( { 'address' : query }, function( results, status ) {
        if( status == google.maps.GeocoderStatus.OK ) {
          //move map to selected address
          map.setCenter( results[0].geometry.location );
          
          //removes old marker if exist
          if (typeof this.marker !== 'undefined'){
            this.marker.setMap(null);
          }
          
          this.marker = new google.maps.Marker( {
            map     : map,
            position: results[0].geometry.location
          } );
        } else {
            console.error( 'Geocode was not successful for the following reason: ' + status );
        }
    } );
    this._googleStore.updateGoogleMap(this.currentMapState);
  }

}
