import { Injectable } from "@angular/core";
import { Map } from '../interfaces/map';

@Injectable()
export class OutdoorMapData implements Map{
    testText: string;

    constructor() {
        this.testText = "Outdoor Map.";
    }
}