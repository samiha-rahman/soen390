import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DirectionFormStore } from '../../providers/state-stores/direction-form-store.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
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
  marker: any;

  private _itemList: string[];
  private _queryType: string;
  private _unsubscribe: UnsubscribeCallback;
  private _maps: any;
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

  moveMap(query: string){
    let currentMapState = this._googleStore.getGoogleMapState();
    let google = currentMapState.google;
    let map = currentMapState.map;
    let coder = currentMapState.geocoder;

    coder.geocode( { 'address' : query }, function( results, status ) {
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
    this._googleStore.updateGoogleMap(currentMapState);
  }

}
