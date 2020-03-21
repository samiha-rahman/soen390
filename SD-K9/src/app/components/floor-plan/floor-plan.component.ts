import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { SVG } from "@svgdotjs/svg.js";

import { SVGManager } from '../../providers/svg-manager.service';
import { Map } from 'src/app/interfaces/map';
import { FloorPlanStore } from '../../providers/state-stores/floor-plan-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { Route } from 'src/app/interfaces/route';
import { RouteCoordinator } from 'src/app/providers/route-coordinator.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';

@Component({
  selector: "floor-plan",
  templateUrl: "./floor-plan.component.html",
  styleUrls: ["./floor-plan.component.scss"]
})
export class FloorPlanComponent implements OnInit, OnDestroy, Map {
  @Input() data: any;
  buildingId: string;
  floor: number;

  private _draw;
  private _unsubscribe: UnsubscribeCallback;

  constructor(
    private _svgManager: SVGManager,
    private _routeCoordinator: RouteCoordinator,
    private _floorPlanStore: FloorPlanStore,
    private _routeStore: RouteStore
    ) {
      this._unsubscribe = this._routeStore.subscribe(() => {
        this._addRouteIfExist();
      });
  }

  ngOnInit() {
    this._drawFloorplan(this.data.building, this.data.floor);
    this._addRouteIfExist();
  }

  private _drawFloorplan(building: string, floor: number) {
    this._svgManager.getSVG(`${building}/${floor}`).subscribe(floorplan => {
      /* find the svg container, clear it and replace with new floorplan */
      this._draw = SVG("#floorplan");
      // this._draw.clear();
      this._draw.svg(floorplan);
    });
  }

  private _addRouteIfExist() {
    if (this.data.id && !this._routeStore.getRoute(this.data.id)) {
      this._floorPlanStore.storeFloorPlan({id:this.data.id, building: this.data.building, floor: this.data.floor}); // store new state
    }
    else {
      // display route too.
      let indoorRoute: Route = this._routeStore.getRoute(this.data.id);
      this._routeCoordinator.getIndoorRoute(indoorRoute.route.source, indoorRoute.route.destination);
    }
  }

  ngOnDestroy() {
    this._draw.clear();
    this._unsubscribe();
  }
}
