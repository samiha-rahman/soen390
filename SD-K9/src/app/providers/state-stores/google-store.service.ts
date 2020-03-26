import { Injectable } from '@angular/core';
import { StateReducer } from '../../interfaces/state-reducer';
import { StateAction } from '../../interfaces/state-action';
import { StateStore } from '../../helpers/state-store';
import { ListenerCallback } from 'src/app/interfaces/listener-callback';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { GoogleMapState } from '../../interfaces/google-map-state';
import { Route } from 'src/app/interfaces/route';

@Injectable({
  providedIn: 'root'
})
export class GoogleStore {
  private _emptyGoogleMapState: GoogleMapState;
  private _NEW: string = 'NEW';
  private _UPDATE: string = 'UPDATE';
  private _UPDATE_ROUTE: string = 'UPDATE_ROUTE';
  private _CLEAR_ROUTE: string = 'CLEAR_ROUTE';
  private _mapReducer: StateReducer<GoogleMapState> = (state: GoogleMapState, action: StateAction): GoogleMapState => {
    switch(action.type) {
      case this._NEW: {
        return action.payload;
      }
      case this._UPDATE: {
        state.google = action.payload.google;
        state.map = action.payload.map;
        return state;
      }
      case this._UPDATE_ROUTE: {
        state.route = action.payload;
        return state;
      }
      case this._CLEAR_ROUTE: {
        state.route = false;
        return state;
      }
    }
  }

  private _googleStore = new StateStore<GoogleMapState>(this._mapReducer, this._emptyGoogleMapState);

  constructor() { }

  storeMap(payload: GoogleMapState) {
    this._googleStore.dispatch({type: this._NEW, payload: payload});
  }

  updateGoogleMap(payload: GoogleMapState) {
    this._googleStore.dispatch({type: this._UPDATE, payload: payload});
  }

  setRoute(route: Route) {
    this._googleStore.dispatch({type: this._UPDATE_ROUTE, payload: route});
  }

  removeRoute() {
    this._googleStore.dispatch({type: this._CLEAR_ROUTE});
  }

  hasRoute(): boolean {
    if (this._googleStore.getState().route) {
      return true;
    }
    else {
      return false;
    }
  }

  getGoogleMapState(): GoogleMapState {
    return this._googleStore.getState();
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    return this._googleStore.subscribe(listener);
  }
}
