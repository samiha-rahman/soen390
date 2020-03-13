/*
* This defines the action of the state pattern:
* "What to do" for the state.
*/
export declare interface StateAction {
    type: string;       // Describes the action like INCREMENT or ADD_USER
    payload?: any;      // Ab object of any kind. (optional)
}