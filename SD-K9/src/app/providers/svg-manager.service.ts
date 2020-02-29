import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SVG } from '@svgdotjs/svg.js';
import { Observable } from 'rxjs';
import { SVGCoordinate } from '../interfaces/svg-coordinate.model';

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
              x: parseInt(node["cx"].baseVal.value),
              y: parseInt(node["cy"].baseVal.value),
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

    polylinePath.attr({ id: 'path' });
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
    const path = SVG('#path');
    if (path) {
      path.remove();
    }
  }

  /**
   * Returns the SVGCoordinate for a classroom using the ID, building and floor
   * @param classID is the classroom's ID
   * @param building is the building in which the classroom is located
   * @param floor is the floor on which the classroom is located
   */
  public async getClassroom(classID: string, building: string, floor: number) {
    return this.getSVG(`${building}/${floor}`)
        .pipe(
            map(svgFile => {
              // return svgFile
              const classrooms = SVG(svgFile).find('circle.classroom');
              const classroom = classrooms.filter((element) => element.node.id === classID)[0];
              return {
                id: classID,
                x: parseInt(classroom.node.cx.baseVal.value),
                y: parseInt(classroom.node.cy.baseVal.value),
                building,
                floor
              };
            })
        )
        .toPromise();
  }

  public async getVerticalTransportation(mode: string, direction: string, building: string, floor: number) {
    return this.getSVG(`${building}/${floor}`)
        .pipe(
            map(svgFile => {
              // return svgFile
              const vtransports = SVG(svgFile).find('g#' + mode + ' circle');
              const vtransport = vtransports.filter((element) => element.node.id.includes(direction))[0];
              // console.log(floor);
              // console.log(vtransports);
              // console.log(vtransport);
              return {
                id: vtransport.id(),
                x: parseInt(vtransport.node.cx.baseVal.value),
                y: parseInt(vtransport.node.cy.baseVal.value),
                building,
                floor
              };
            })
        )
        .toPromise();
  }
}
