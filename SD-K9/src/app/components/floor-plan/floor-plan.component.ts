import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';

import { SVGManager } from '../../providers/svg-manager.service';
import * as svgPanZoom from 'svg-pan-zoom';
import { Map } from 'src/app/interfaces/map';
import 'hammerjs';
import { FloorPlanStore } from '../../providers/state-stores/floor-plan-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { Route } from 'src/app/interfaces/route';
import { IndoorRouteCoordinator } from 'src/app/providers/indoor-route-coordinator.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';

@Component({
  selector: 'floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent implements OnInit, OnDestroy, Map {
  @Input() data: any;
  buildingId: string;
  floor: number;

  private _draw;
  private _panZoomInstance;
  private _unsubscribe: UnsubscribeCallback;

  constructor(
    private _svgManager: SVGManager,
    private _routeCoordinator: IndoorRouteCoordinator,
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
      this._draw = SVG('#floorplan');
      this._draw.svg(floorplan);

      // get viewbox
      const bbox = this._draw.node.firstElementChild.viewBox.baseVal;
      const svg = document.getElementsByTagName('svg')[0];
      this._setPanZoom();
      svg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
    });

  }

  private _setPanZoom() {
    let beforePan;
    const bbox = this._draw.node.firstElementChild.viewBox.baseVal;

    beforePan = function(oldPan, newPan) {
      const stopHorizontal = false
          , stopVertical = false
          // Computed variables
          , sizes = this.getSizes()
          , leftLimit = - (bbox.width * sizes.realZoom) + bbox.width
          , rightLimit = 0
          , topLimit = - (bbox.height * sizes.realZoom) + bbox.height
          , bottomLimit = 0;

      const x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
      const y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

      return {x, y};
    };

    let eventsHandler;
    eventsHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
      , init: function(options) {
        let instance = options.instance
            , initialScale = 1
            , pannedX = 0
            , pannedY = 0;

        // Init Hammer
        // Listen only for pointer and touch events
        this.hammer = new Hammer(options.svgElement, {
          inputClass: Hammer.PointerEventInput
        });

        // Enable pinch
        this.hammer.get('pinch').set({enable: true});

        // Handle double tap
        this.hammer.on('doubletap', (ev) => {
          if (instance.getZoom() < 1.5) {
            instance.zoom(2);
          } else {
            instance.zoom(1);
          }
        });

        // Handle pan
        this.hammer.on('panstart panmove', (ev) => {
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0;
            pannedY = 0;
          }

          // Pan only the difference
          instance.panBy({x: (ev.deltaX - pannedX) * instance.getZoom(), y: (ev.deltaY - pannedY) * instance.getZoom()});
          pannedX = ev.deltaX;
          pannedY = ev.deltaY;
        });

        // Handle pinch
        this.hammer.on('pinchstart pinchmove', (ev) => {
          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom();
            instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y});
          }

          instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y});
        });

        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', (e) => { e.preventDefault(); });
      }

      , destroy: function() {
        this.hammer.destroy();
      }
    };

    this._panZoomInstance = svgPanZoom('#floorplan', {
      zoomEnabled: true,
      panEnabled: true,
      dblClickZoomEnabled: false,
      controlIconsEnabled: false,
      customEventsHandler: eventsHandler,
      beforePan: beforePan,
      center: true,
      fit: false,
      zoomScaleSensitivity: 0.2,
      minZoom: 1,
      maxZoom: 2
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
