import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { SVG } from "@svgdotjs/svg.js";

import { SVGManager } from '../../providers/svg-manager.service';
import { Map } from 'src/app/interfaces/map';

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

  constructor(private _svgManager: SVGManager) {
  }

  ngOnInit() {
    this._drawFloorplan(this.data.building, this.data.floor);
  }

  private _drawFloorplan(building: string, floor: number) {
    this._svgManager.getSVG(`${building}/${floor}`).subscribe(floorplan => {
      /* find the svg container, clear it and replace with new floorplan */
      this._draw = SVG("#floorplan");
      // this._draw.clear();
      this._draw.svg(floorplan);
    });
  }

  ngOnDestroy() {
    this._draw.clear();
  }
}
