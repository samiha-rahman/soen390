import { Injectable } from '@angular/core';
import { StateReducer } from '../../interfaces/state-reducer';
import { StateAction } from '../../interfaces/state-action';
import { RouteState } from '../../interfaces/route-state';
import { StateStore } from '../../helpers/state-store';
import { Route } from '../../interfaces/route';
import { ListenerCallback } from 'src/app/interfaces/listener-callback';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';

@Injectable({
  providedIn: 'root'
})
export class RouteStore {
  private _emptyRouteState: RouteState = {routes: []};
  private _ADD: string = 'ADD';
  private _SHIFT: string = 'SHIFT';
  private _CLEAR: string = 'CLEAR';
  private _routeReducer: StateReducer<RouteState> = (state: RouteState, action: StateAction): RouteState => {
    switch(action.type) {
      case this._ADD: {
        state.routes.push(action.payload);
        return state;
      }
      case this._SHIFT: {
        state.routes.shift();
        return state;
      }
      case this._CLEAR: {
        state.routes.splice(0, state.routes.length);
        return state;
      }
    }
  };

  private _routeStore = new StateStore<RouteState>(this._routeReducer, this._emptyRouteState);

  constructor() { }

  storeRoute(payload: Route) {
    this._routeStore.dispatch({type: this._ADD, payload: payload});
  }

  shiftRoutes() {
    this._routeStore.dispatch({type: this._SHIFT});
  }

  clearRoutes() {
    this._routeStore.dispatch({type: this._CLEAR});
  }

  getRoute(id: number): Route {
    return this._routeStore.getState().routes.find(r => r.id === id);
  }

  getRouteState(): RouteState {
    return this._routeStore.getState();
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    return this._routeStore.subscribe(listener);
  }
}
