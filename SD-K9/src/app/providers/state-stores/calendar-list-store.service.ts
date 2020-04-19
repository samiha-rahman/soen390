import { Injectable } from '@angular/core';
import { StateReducer } from 'src/app/interfaces/states/state-reducer';
import { CalendarListState, CalendarIdState } from 'src/app/interfaces/states/calendar-list-state';
import { StateAction } from 'src/app/interfaces/states/state-action';
import { StateStore } from 'src/app/helpers/state-store';
import { ListenerCallback } from 'src/app/interfaces/listener-callback';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';

@Injectable({
  providedIn: 'root'
})
export class CalendarListStore {
  private _emptyCalendarListState: CalendarListState = {calendarIds: []};
  private _ADD: string = 'ADD';
  private _OVERRIDE: string = 'OVERRIDE';
  private _CLEAR: string = 'CLEAR';
  private _calendarListReducer: StateReducer<CalendarListState> = (state: CalendarListState, action: StateAction): CalendarListState => {
    switch(action.type) {
      case this._ADD: {
        state.calendarIds.push(action.payload);
        return state;
      }
      case this._OVERRIDE: {
        state.calendarIds = action.payload;
        return state;
      }
      case this._CLEAR: {
        state.calendarIds.splice(0, state.calendarIds.length);
        return state;
      }
    }
  }

  private _calendarListStore = new StateStore<CalendarListState>(this._calendarListReducer, this._emptyCalendarListState);

  constructor() { }

  storeCalendarId(payload: CalendarIdState) {
    this._calendarListStore.dispatch({type: this._ADD, payload: payload});
  }

  getCalendarListState(): CalendarListState {
    return this._calendarListStore.getState();
  }

  updateCheckedValues(payload: CalendarIdState[]) {
    this._calendarListStore.dispatch({type: this._OVERRIDE, payload: payload});
  }

  clear() {
    this._calendarListStore.dispatch({type: this._CLEAR});
  }

  subscribe(listener: ListenerCallback): UnsubscribeCallback {
    return this._calendarListStore.subscribe(listener);
  }
}
