import { StateReducer } from "../interfaces/states/state-reducer";
import { StateAction } from "../interfaces/states/state-action";
import { ListenerCallback } from "../interfaces/listener-callback";
import { UnsubscribeCallback } from "../interfaces/unsubscribe-callback";

export class StateStore<T> {
    private _state: T;
    private _listeners: ListenerCallback[] = [];

    constructor (
        private _reducer: StateReducer<T>,
        public initialState: T
    ) {
        this._state = initialState;
    }

    getState(): T {
        return this._state;
    }

    /*
    * This takes an action, sends it to the reducer and then updates the value of the current state (this._state)
    * Then calls the listeners because of a new action and a state change.
    */
    dispatch(action: StateAction) {
        this._state = this._reducer(this._state, action);
        this._listeners.forEach((listener: ListenerCallback) => listener());
    }

    /*
    * Returns a value funstion of the updated list of _listeners that is _listeners without the listener.
    * So it returns the unsubscribe function that can be used to remove the listener from _listeners.
    */ 
    subscribe(listener: ListenerCallback): UnsubscribeCallback {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !==  listener);
        }
    }
}