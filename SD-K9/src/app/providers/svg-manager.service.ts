import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SVG } from '@svgdotjs/svg.js';
import { Observable } from 'rxjs';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { forEach } from '@angular-devkit/schematics';

@Injectable({
  providedIn: 'root'
})
export class SVGManager {

  constructor(private http: HttpClient) { }

  /**
   * returns the text from an svg file in the assets folder.
   *
   * the floor plans are organized as follows:
   * building/floornumber
   * @param file the file where the svg is located (ex: getSVG('hall/10'))
   */
  public getSVG(file: string): Observable<string> {
    return this.http.get(`../../assets/${file}.svg`, { responseType: 'text' });
  }

  /**
   * Extracts the walkable nodes from the SVG floorplan
   */
  public getWalkableNodes(building, floor): Promise<SVGCoordinate[]> {
    return this.getSVG(`${building}/${floor}`)
      .pipe(
        map(svgFile => {
          // return svgFile
          const floorplan = SVG(svgFile);
          const nodes = floorplan.find('circle.node');
          const walkable: SVGCoordinate[] = [];

          nodes.forEach(element => {
            const node = element.node;

            /* Create a PositionNode Obj */
            const walkableNode: SVGCoordinate = {
              id: node.id,
              x: parseInt(node['cx'].baseVal.value),
              y: parseInt(node['cy'].baseVal.value),
              building,
              floor
            };

            walkable.push(walkableNode);
          });

          return walkable;
        })
      )
      .toPromise();
  }

  public getDistanceBetweenNeighbors(building, floor): Promise<number> {
    return this.getSVG(`${building}/${floor}`)
      .pipe(
        map(svgFile => {
          const element: any = SVG(svgFile).find('g#path');
          return Number(element[0].node.attributes['distance-between-neighbors'].value);
        })
      )
      .toPromise();
  }

  /**
   * Draw's the path on the SVG
   * @param coordinates The coodinates of the points making the path polyline
   * @param isFocused Will change the color of the path depending if it is focused or not
   */
  public drawSVGPath(coordinates: SVGCoordinate[], isFocused: boolean) {
    const draw = SVG()
      .addTo('#floorplan');
    let path = '';

    const color = isFocused ? '#3880ff' : '#85b1ff';

    coordinates.forEach((coordinate: SVGCoordinate) => {
      path = `${path}${coordinate.x},${coordinate.y} `;
    });

    const polylinePath = draw.polyline(path);

    polylinePath.attr({ class: 'path' });
    polylinePath.fill('none');
    polylinePath.stroke({
      color,
      width: 6,
      linecap: 'round',
      linejoin: 'round'
    });
    polylinePath.front();
  }

  /**
   * removes the SVG path from the floorplan
   */
  public removeSVGPath() {
    // Removing the old path
    const path = SVG('.path');
    if (path) {
      path.remove();
    }
  }

  /**
   * Returns the SVGCoordinate for a classroom using the ID, building and floor
   * @param locationID is the classroom's ID
   * @param building is the building in which the classroom is located
   * @param floor is the floor on which the classroom is located
   */
  public getSVGCoordFromID(locationID: string, building: string, floor: number) {
      return this.getSVG(`${building}/${floor}`)
          .pipe(
              map(svgFile => {
                  // return svgFile
                  const vtransports = SVG(svgFile).find('circle');
                  const vtransport = vtransports.filter((element) => element.node.id === locationID)[0];
                  const node: SVGCircleElement = vtransport.node as any;
                  return {
                      id: node.id,
                      x: parseInt(node.cx.baseVal.value.toString()),
                      y: parseInt(node.cy.baseVal.value.toString()),
                      building,
                      floor
                  };
              })
          )
          .toPromise();
  }

  public getClosestVerticalTransportationId(
    mode: string,
    direction: string,
    svgCoordinate: SVGCoordinate) {
    return this.getSVG(`${svgCoordinate.building}/${svgCoordinate.floor}`)
      .pipe(
        map(svgFile => {
          // return svgFile
          const vtransports = SVG(svgFile).find('g#' + mode + ' circle');
          let vtransport;
          if (mode === 'escalators') {
            vtransport = vtransports.filter((element) => element.node.id.includes(direction))[0];
          } else {
            let minOption = 0;
            let minDistance = 1000;
            const locX = svgCoordinate.x;
            const locY = svgCoordinate.y;
            for (let x = 0; x < vtransports.length; x++) {
              const el: SVGCircleElement = vtransports[x].node as any;
              const distance = Math.sqrt(Math.pow(locX - el.cx.baseVal.value, 2) + Math.pow(locY - el.cy.baseVal.value, 2));
              if (distance < minDistance) {
                minDistance = distance;
                minOption = x;
              }
            }
            vtransport = vtransports[minOption];
          }
          const node: SVGCircleElement = vtransport.node as any;
          return (node.id);
        })
      )
      .toPromise();
  }
}
