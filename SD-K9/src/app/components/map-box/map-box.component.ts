import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { MapItem } from '../../helpers/map-item';
import { MapDirective } from '../../directives/map.directive';
import { Map } from '../../interfaces/map';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit, OnDestroy {
  @Input() maps: MapItem[];
  @ViewChild(MapDirective, {static: true}) mapHost: MapDirective;
  private _currentMapIndex = -1;
  private _interval: any; //TODO: specify type

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponent();
    // this.getMaps();
  }

  loadComponent() {
    this._currentMapIndex = (this._currentMapIndex + 1) % this.maps.length;
    const mapItem = this.maps[this._currentMapIndex]; // Map selected

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(mapItem.component); //Map selected is resolved

    const viewContainerRef = this.mapHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory); //adds selected component to the ViewContainerRef
    (<Map>componentRef.instance).data = mapItem.data;
  }

  nextMap() {
    // this._interval = setInterval(() => {
    //   this.loadComponent();
    // }, 10000);
    this.loadComponent();
  }

  ngOnDestroy() {
    clearInterval(this._interval);
  }

}
