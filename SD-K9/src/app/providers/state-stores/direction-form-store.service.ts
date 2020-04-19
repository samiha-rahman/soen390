import { Injectable } from '@angular/core';
import { StateReducer } from '../../interfaces/states/state-reducer';
import { StateAction } from '../../interfaces/states/state-action';
import { StateStore } from '../../helpers/state-store';
import { DirectionForm } from '../../interfaces/direction-form';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Transport } from '../../models/transport.enum.model';
import { ListenerCallback } from '../../interfaces/listener-callback';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';
import { VerticalTransport } from 'src/app/models/vertical-transport.enum.model';

@Injectable({
    providedIn: 'root'
})
export class DirectionFormStore {
    private _newDirectionForm: DirectionForm = { sourceDestination: { source: '', destination: '' }, transport: Transport.TRANSIT, verticalTransport: VerticalTransport.ESCALATORS };
    private _SET_SOURCE: string = "SET_SOURCE";
    private _SET_DESTINATION: string = "SET_DESTINATION";
    private _SET_TRANSPORT: string = "SET_TRANSPORT";
    private _SET_VERTICAL_TRANSPORT: string = "SET_VERTICAL_TRANSPORT";
    private _SET_ALL: string = "SET_ALL";
    private _CLEAR: string = "CLEAR";
    private _directionFormReducer: StateReducer<DirectionForm> = (state: DirectionForm, action: StateAction): DirectionForm => {
        switch (action.type) {
            case this._SET_SOURCE: {
                state.sourceDestination.source = action.payload;
                return state;
            }
            case this._SET_DESTINATION: {
                state.sourceDestination.destination = action.payload;
                return state;
            }
            case this._SET_TRANSPORT: {
                state.transport = action.payload;
                return state;
            }
            case this._SET_VERTICAL_TRANSPORT: {
                state.verticalTransport = action.payload;
                return state;
            }
            case this._SET_ALL: {
                state = action.payload;
                return state;
            }
            case this._CLEAR: {
                state.sourceDestination.source = '',
                    state.sourceDestination.destination = '',
                    state.transport = Transport.TRANSIT;
                return state;
            }
        }
    }

    private _directionFormStore = new StateStore<DirectionForm>(this._directionFormReducer, this._newDirectionForm);

    constructor() { }

    setSource(payload: string) {
        this._directionFormStore.dispatch({ type: this._SET_SOURCE, payload: payload });
    }

    setDestination(payload: string) {
        this._directionFormStore.dispatch({ type: this._SET_DESTINATION, payload: payload });
    }

    setTransport(payload: string) {
        this._directionFormStore.dispatch({ type: this._SET_TRANSPORT, payload: payload });
    }

    setVerticalTransport(payload: string) {
        this._directionFormStore.dispatch({ type: this._SET_VERTICAL_TRANSPORT, payload: payload });
    }

    updateAllParams(payload: DirectionForm) {
        this._directionFormStore.dispatch({ type: this._SET_ALL, payload: payload });
    }

    getDirectionFormState(): DirectionForm {
        return this._directionFormStore.getState();
    }

    clear() {
        this._directionFormStore.dispatch({ type: this._CLEAR });
    }

    subscribe(listener: ListenerCallback): UnsubscribeCallback {
        return this._directionFormStore.subscribe(listener);
    }
}
