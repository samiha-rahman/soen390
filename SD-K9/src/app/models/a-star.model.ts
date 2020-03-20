import { SVGCoordinate } from "./svg-coordinate.model";

export interface AStarNode {
  parent: AStarNode;
  value: SVGCoordinate;
  g: number;
  h: number;
  f: number;
}
