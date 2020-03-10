import { Type } from '@angular/core';

export class MapItem {
    constructor(public component: Type<any>, public data: any) {}
}