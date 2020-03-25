import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[map-host]'
})
export class MapDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
