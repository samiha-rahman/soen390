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
  map: any;
  geocoder: any;
  latlng: any;
  address: any;

  private _itemList: string[];
  private _queryType: string;
  private _unsubscribe: UnsubscribeCallback;

  public currentQuery: string;

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

    this.currentMapState = this._googleStore.getGoogleMapState();
    this.map = this.currentMapState.map;
  }

  goToHomePage() {
    this._navController.navigateBack("home");
  }

  changeQuery(query: string) {
    this.itemList = [];
    this.currentQuery = query;
    for (const item of this._itemList) {
      if (item.toUpperCase().includes(query.toUpperCase())) {
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
    let currentMapState = this._googleStore.getGoogleMapState();
    let google = currentMapState.google;
    let map = currentMapState.map;
    let self = this;
    let currentPos = currentMapState.currentpos;
    let coder = currentMapState.geocoder;
    let address;
    
    this.latlng = {lat: currentPos.lat(), lng: currentPos.lng()}; 

    coder.geocode({'location': this.latlng}, function(results, status) 
    {
      if(status === "OK"){
        self.enterQuery(results[0].formatted_address);
      } else{
        console.error( 'Geocode was not successful for the following reason: ' + status );
      }
    });

    this._navController.navigateBack("home");
  }
}
