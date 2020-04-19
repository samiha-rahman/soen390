import { StateAction } from "./state-action";

/*
* This takes the state and the StateAction and returns a new state.
* The state stores all of the data in the application.
*/
export declare interface StateReducer<T> {
    (state: T, action: StateAction): T;
}