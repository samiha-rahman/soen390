import { Injectable } from '@angular/core';
import { StateReducer } from '../../interfaces/states/state-reducer';
import { StateAction } from '../../interfaces/states/state-action';
import { StateStore } from '../../helpers/state-store';
import { QueuedRouteState } from '../../interfaces/states/queued-routes-state';
import { ListenerCallback } from '../../interfaces/listener-callback';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';
import { QueuedRoute } from '../../interfaces/queued-route';

@Injectable({
  providedIn: 'root'
})

export class QueuedRouteStore {
    private _emptyQueuedRouteState: QueuedRouteState = {routes: []};
 
    private _CLEAR: string = 'CLEAR';
    private _ADD: string = 'ADD';
    private _SHIFT: string = 'SHIFT';

    private _queuedRouteReducer: StateReducer<QueuedRouteState> = (state: QueuedRouteState, action: StateAction): QueuedRouteState => {
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
    }
    private _queuedRouteStore = new StateStore<QueuedRouteState>(this._queuedRouteReducer, this._emptyQueuedRouteState);

    constructor() { }

    getQueuedRouteState(): QueuedRouteState {
        return this._queuedRouteStore.getState();
    }

    getQueuedRoute(id: number): QueuedRoute {
    return this._queuedRouteStore.getState().routes.find(r => r.id === id);
  }

    clearQueuedRoute() {
        this._queuedRouteStore.dispatch({type: this._CLEAR});
    }

    subscribe(listener: ListenerCallback): UnsubscribeCallback {
        return this._queuedRouteStore.subscribe(listener);
    }
}


