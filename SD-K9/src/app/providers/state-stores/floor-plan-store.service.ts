import { Injectable } from '@angular/core';
import { FloorPlanState } from '../../interfaces/states/floor-plan-state';
import { StateReducer } from '../../interfaces/states/state-reducer';
import { StateAction } from '../../interfaces/states/state-action';
import { StateStore } from '../../helpers/state-store';
import { FloorPlanIdentifier } from '../../interfaces/floor-plan-identifier';
import { ListenerCallback } from '../../interfaces/listener-callback';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';

@Injectable({
  providedIn: 'root'
})
export class FloorPlanStore {
  private _emptyFloorPlanState: FloorPlanState = {floorPlanIdentifiers: []};
  private _ADD: string = 'ADD';
  private _SHIFT: string = 'SHIFT';
  private _CLEAR: string = 'CLEAR';
  private _floorPlanReducer: StateReducer<FloorPlanState> = (state: FloorPlanState, action: StateAction): FloorPlanState => {
    switch(action.type) {
      case this._ADD: {
        state.floorPlanIdentifiers.push(action.payload);
        return state;
      }
      case this._SHIFT: {
        state.floorPlanIdentifiers.shift();
        return state;
      }
      case this._CLEAR: {
        state.floorPlanIdentifiers.splice(0, state.floorPlanIdentifiers.length);
        return state;
      }
    }
  };

  private _floorPlanStore = new StateStore<FloorPlanState>(this._floorPlanReducer, this._emptyFloorPlanState);

  constructor() { }

  storeFloorPlan(payload: FloorPlanIdentifier) {
    this._floorPlanStore.dispatch({type: this._ADD, payload: payload});
  }

  shiftFloorPlans() {
    this._floorPlanStore.dispatch({type: this._SHIFT});
  }

  clearFloorPlans() {
    this._floorPlanStore.dispatch({type: this._CLEAR});
  }

  getFloorPlan(id: number): FloorPlanIdentifier {
    return this._floorPlanStore.getState().floorPlanIdentifiers.find(fpi => fpi.id === id);
  }

  getFloorPlanState(): FloorPlanState {
    return this._floorPlanStore.getState();
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    return this._floorPlanStore.subscribe(listener);
  }
}
