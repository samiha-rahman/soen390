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

  constructor(private _svgManager: SVGManager) {}

  ngOnInit() {
    this._drawFloorplan(this.data.building, this.data.floor);
  }

  private _drawFloorplan(building: string, floor: number) {
    this._svgManager.getSVG(`${building}/${floor}`).subscribe(floorplan => {
      /* find the svg container, clear it and replace with new floorplan */
      this._draw = SVG('#floorplan');
      this._draw.clear();
      this._draw.svg(floorplan);
      this._setPanZoom();
    });
  }

  private _setPanZoom() {
    let beforePan;
    beforePan = function(oldPan, newPan) {
      const stopHorizontal = false
          , stopVertical = false
          // Computed variables
          , sizes = this.getSizes()
          , leftLimit = - (sizes.viewBox.width * sizes.realZoom) + sizes.viewBox.width
          , rightLimit = 0
          , topLimit = - (sizes.viewBox.height * sizes.realZoom) + sizes.viewBox.height
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
          instance.panBy({x: (ev.deltaX - pannedX) / instance.getZoom(), y: (ev.deltaY - pannedY) / instance.getZoom()});
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

    const svg = document.getElementsByTagName('svg')[0];
    const bbox = svg.getBBox();
    svg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
  }

  ngOnDestroy() {
    this._draw.clear();
  }
}
