import { Injectable } from '@angular/core';
import { StateReducer } from '../../interfaces/state-reducer';
import { StateAction } from '../../interfaces/state-action';
import { StateStore } from '../../helpers/state-store';
import { MapModeState } from '../../interfaces/map-mode-state';
import { ListenerCallback } from '../../interfaces/listener-callback';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';
import { OutdoorMapComponent } from 'src/app/components/outdoor-map/outdoor-map.component';
import { FloorPlanComponent } from 'src/app/components/floor-plan/floor-plan.component';
import { ViewMode } from  '../../models/view-mode.enum.model';

@Injectable({
  providedIn: 'root'
})
export class MapModeStore {
  private _defaultView: MapModeState = {component: OutdoorMapComponent, data: {id: 1}};
  private _mapModeReducer: StateReducer<MapModeState> = (state: MapModeState, action: StateAction): MapModeState => {
    switch(action.type) {
      case ViewMode.GOOGLE: {
        state.component = OutdoorMapComponent;
        state.data = {id: 1};
        return state;
      }
      case ViewMode.HALL: {
        state.component = FloorPlanComponent;
        state.data = {id: 1, floor: 8, building: 'hall'};
        return state;
      }
      case ViewMode.CC: {
        state.component = FloorPlanComponent;
        state.data = {id: 1, floor: 1, building: 'loyola'};
        return state;
      }
      case ViewMode.CUSTOM_INDOOR: {
        state.component = FloorPlanComponent;
        state.data = action.payload;
        return state;
      }
    }
  }

  private _mapModeStore = new StateStore<MapModeState>(this._mapModeReducer, this._defaultView);

  constructor() { }

  setMode(mode: ViewMode, payload?: any) {
    if (mode === ViewMode.CUSTOM_INDOOR && payload) {
      this._mapModeStore.dispatch({type: mode, payload: payload});
    }
    else {
      this._mapModeStore.dispatch({type: mode});
    }
  }

  getMapModeState(): MapModeState {
    return this._mapModeStore.getState();
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    return this._mapModeStore.subscribe(listener);
  }
}
