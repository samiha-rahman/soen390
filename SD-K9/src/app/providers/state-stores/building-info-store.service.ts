import { Injectable } from '@angular/core';
import { StateReducer } from '../../interfaces/states/state-reducer';
import { StateAction } from '../../interfaces/states/state-action';
import { StateStore } from '../../helpers/state-store';
import { BuildingInfoState } from '../../interfaces/states/building-info-state';
import { ListenerCallback } from '../../interfaces/listener-callback';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';

@Injectable({
  providedIn: 'root'
})
export class BuildingInfoStore {
  private _emptyBuildingInfoState: BuildingInfoState = {building: '', campus: '', slug: ''};
  private _UPDATE: string = 'ADD';
  private _CLEAR: string = 'CLEAR';
  private _buildingInfoReducer: StateReducer<BuildingInfoState> = (state: BuildingInfoState, action: StateAction): BuildingInfoState => {
    switch(action.type) {
      case this._UPDATE: {
        state.building = action.payload.building;
        state.campus = action.payload.campus;
        state.slug = action.payload.slug;
        return state;
      }
      case this._CLEAR: {
        state.building = '';
        state.campus = '';
        state.slug = '';
        return state;
      }
    }
  }

  private _buildingInfoStore = new StateStore<BuildingInfoState>(this._buildingInfoReducer, this._emptyBuildingInfoState);

  constructor() { }

  setBuildingInfo(payload: BuildingInfoState) {
    this._buildingInfoStore.dispatch({type: this._UPDATE, payload: payload});
  }

  getBuildingInfo(): BuildingInfoState {
    return this._buildingInfoStore.getState();
  }

  clearBuildingInfo() {
    this._buildingInfoStore.dispatch({type: this._CLEAR});
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    return this._buildingInfoStore.subscribe(listener);
  }
}
