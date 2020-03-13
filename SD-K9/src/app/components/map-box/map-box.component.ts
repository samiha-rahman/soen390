import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnDestroy, SimpleChanges } from '@angular/core';
import { MapItem } from '../../helpers/map-item';
import { MapDirective } from '../../directives/map.directive';
import { Map } from '../../interfaces/map';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { Route } from 'src/app/interfaces/route';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit, OnDestroy {
  @Input() maps: MapItem[];
  @ViewChild(MapDirective, {static: true}) mapHost: MapDirective;
  private _currentMapIndex: number = -1;
  private _numRoutes: number;
  private _unsubscribe: UnsubscribeCallback;
  
  public currentMapIndex: number = -1;
  public numRoutes: number = -1;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _routeStore: RouteStore,
    private _mapCoordinator: MapCoordinator
  ) {
    this._unsubscribe = this._routeStore.subscribe(() => {
      this._numRoutes = this._routeStore.getRouteState().routes.length - 1;
    });
   }

  ngOnInit() {
    this._loadComponent(1);
  }
  
  ngOnChanges() {
    this._currentMapIndex = -1;;
    this.numRoutes = 1;
    this._loadComponent(1);
  }

  private _loadComponent(index: number) {
    this._currentMapIndex = (this._currentMapIndex + index) % this.maps.length;
    const mapItem = this.maps[this._currentMapIndex]; // Map selected

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(mapItem.component); //Map selected is resolved

    const viewContainerRef = this.mapHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory); //adds selected component to the ViewContainerRef
    (<Map>componentRef.instance).data = mapItem.data;
    this.currentMapIndex = this._currentMapIndex;

    // TODO: refactor below: move this in better place
    if (this._currentMapIndex === 1) {
      let indoorRoute: Route = this._routeStore.getRoute(2);
      this._mapCoordinator.getRoute(indoorRoute.route.source, indoorRoute.route.destination);
    }
  }

  nextMap() {
    // this._interval = setInterval(() => {
    //   this.loadComponent();
    // }, 10000);
    this._loadComponent(1);
  }

  previousMap() {
    this._loadComponent(-1);
  }

  ngOnDestroy() {
    // clearInterval(this._interval);
    this._unsubscribe();
  }

}
