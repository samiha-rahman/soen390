import { Injectable } from '@angular/core';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { AStarNode } from '../models/a-star.model';
import { MinHeap } from '../helpers/heap';
import { SVGManager } from './svg-manager.service';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class Pathfinder {
  private distanceBetweenNeighbors: number;

  constructor(private svgManager: SVGManager) { }

  /**
   * Returns the nodes needed to be traversed to go from A to B.
   * Point A and Point B need to be on the same floorplan.
   *
   * @param pointA start point
   * @param pointB end point
   */
  public async getShortestPath(
    pointA: SVGCoordinate,
    pointB: SVGCoordinate
  ): Promise<SVGCoordinate[]> {

    if (pointA.building !== pointB.building || pointA.floor !== pointB.floor) {
      throw new Error('Are you sure the start and end points are in the same floor of the same building?');
    }
    const currentBuilding = pointA.building;
    const currentFloor = pointA.floor;

    /* Getting the walkable nodes */
    const walkablePath = await this.svgManager.getWalkableNodes(currentBuilding, currentFloor);
    this.distanceBetweenNeighbors = await this.svgManager.getDistanceBetweenNeighbors(currentBuilding, currentFloor);

    /* Creating the start node */
    const startHeuristic = this.distance(pointA, pointB);
    const start: AStarNode = {
      parent: null,
      value: pointA,
      g: 0,
      h: startHeuristic,
      f: startHeuristic + 0
    };

    /* open minHeap keeps track of the discovered nodes not visited yet */
    const open: MinHeap = new MinHeap([start]);
    /* Closed list keeps track of the nodes visited already */
    const closed: AStarNode[] = [];

    const count = 0;

    /* Looping until the open list is empty */
    while (open.heapSize() > 0) {

      /* prevents an infinite loop if something goes wrong */
      if (count > 20000) {
        throw Error('Cannot find path');
      }

      /* Getting and removing the next node from the open list */
      const current: AStarNode = open.extractMin();
      /* Putting it in the closed list */
      closed.push(current);

      if (this.checkGoal(current.value, pointB)) {
        return this.backtrackFrom(current);
      }

      /* Getting the nodes that are possible to visit from the current node */
      const neighbors = this.getNeighbors(current, walkablePath, pointB);

      for (const neighbor of neighbors) {
        /* Skip if it is already in the closed list */
        if (
          closed.some(node => node.value.x === neighbor.value.x
            && node.value.y === neighbor.value.y)
        ) {
          continue;
        }

        const old = open.find(neighbor);

        /* If it is not in the open list, add it
         * if it is in the open list, update it
         */
        if (!old.node) {
          open.insert(neighbor);
        } else if (neighbor.g < old.node.g) {

          const updatedNode: AStarNode = {
            parent: current,
            value: old.node.value,
            g: neighbor.g,
            h: neighbor.h,
            f: neighbor.f
          };
          open.update(old.index, updatedNode);
        }
      }
    }
    // If It reaches here, it means no path was found
    throw new Error('Can\'t find a way there');
  }

  /**
   * Returns the path taken to arrive at that node
   * @param endNode Node from which we want to backtrack
   */
  private backtrackFrom(endNode: AStarNode): SVGCoordinate[] {
    let current = endNode;
    const path = [];
    while (current) {
      path.push(current.value);
      current = current.parent;
    }
    return path.reverse();
  }

  /**
   * Checks if two nodes are neighbors
   *
   * @param a point A
   * @param b point B
   */
  private isNeighbor(a: SVGCoordinate, b: SVGCoordinate) {
    return this.distance(a, b) < this.distanceBetweenNeighbors;
  }

  /**
   * returns the possible nodes to visit from a parent node.
   * @param parentNode the node who's neighbors we are looking for
   */
  private getNeighbors(
    parentNode: AStarNode,
    possibleNeighbors: SVGCoordinate[],
    goalNode: SVGCoordinate
  ) {
    const neighbors: AStarNode[] = [];


    possibleNeighbors.forEach(possibleNode => {
      if (this.isNeighbor(possibleNode, parentNode.value)) {
        const g = parentNode.g + this.distance(possibleNode, parentNode.value);
        const h = this.distance(possibleNode, goalNode);
        const f = g + h;

        const childNode: AStarNode = {
          parent: parentNode,
          value: possibleNode,
          g,
          h,
          f
        };

        neighbors.push(childNode);
      }
    });

    return neighbors;
  }

  /**
   * Checks if the given node is the goal state,
   * meaning the end of the path.
   */
  private checkGoal(currentNode: SVGCoordinate, goalNode: SVGCoordinate) {
    return currentNode.x === goalNode.x && currentNode.y === goalNode.y;
  }

  /**
   * Calculates the distance from A to B
   * @param a position node A
   * @param b  position node B
   */
  distance(a: SVGCoordinate, b: SVGCoordinate): number {
    if (isNaN(a.x) || isNaN(a.y) || isNaN(b.x) || isNaN(b.y)) {
      throw new Error('Are you sure both coordinates have a numerical x and y?')
    } else {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }
  }
}
