import {
  Component,
  OnInit,
  Input,
  SimpleChanges
} from "@angular/core";
// import { SvgService } from "src/app/providers/svg.service";
import { SVG } from "@svgdotjs/svg.js";

import { SVGManager } from '../../providers/svg-manager.service';

@Component({
  selector: "floor-plan",
  templateUrl: "./floor-plan.component.html",
  styleUrls: ["./floor-plan.component.scss"]
})
export class FloorPlanComponent implements OnInit {
  @Input("building") buildingId: string;
  @Input() floor: number;

  private draw;

  constructor(private _svgManager: SVGManager) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    /* if the floor or building is changes, 
      then the floorplan needs to be changed too */
    if (changes.floor || changes.buildingId) {
      if (changes.buildingId) {
        this.buildingId = changes.buildingId.currentValue;
      }

      if (changes.floor) {
        this.floor = changes.floor.currentValue;
      }

      this.drawFloorplan(this.buildingId, this.floor);
    }
  }

  drawFloorplan(building: string, floor: number) {
    this._svgManager.getSVG(`${building}/${floor}`).subscribe(floorplan => {
      /* find the svg container, clear it and replace with new floorplan */
      this.draw = SVG("#floorplan");
      this.draw.clear();
      this.draw.svg(floorplan);
    });
  }
}
