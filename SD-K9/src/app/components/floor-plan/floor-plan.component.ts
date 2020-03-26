import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { SVG } from "@svgdotjs/svg.js";

import { SVGManager } from '../../providers/svg-manager.service';
import * as svgPanZoom from 'svg-pan-zoom';
import { Map } from 'src/app/interfaces/map';
import {isNumber} from 'util';

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
          // , gutterWidth = 400
          // , gutterHeight = 400
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

    this._panZoomInstance = svgPanZoom('#floorplan', {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: false,
      beforePan: beforePan,
      center: true,
      minZoom: 1,
      maxZoom: 2
    });

    const svg = document.getElementsByTagName("svg")[0];
    const bbox = svg.getBBox();

    svg.setAttribute("width", '100%');
    // svg.setAttribute("height", bbox.height + "px");
    svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);
  }

  ngOnDestroy() {
    this._draw.clear();
  }
}
