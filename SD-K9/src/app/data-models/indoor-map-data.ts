import { Injectable } from "@angular/core";
import { Map } from '../interfaces/map';

@Injectable()
export class IndoorMapData implements Map {
    testText: string;

    constructor() {
        this.testText = "Indoor Map.";
    }
} 