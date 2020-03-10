import { Injectable } from '@angular/core';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { AStarNode } from '../models/a-star.model';
import { MinHeap } from '../helpers/heap';
import { SVGManager } from './svg-manager.service';

@Injectable()
export class Pathfinder {
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
    pointB: SVGCoordinate,
    building: string,
    floor: number
  ): Promise<SVGCoordinate[]> {

    /* Getting the walkable nodes */
    const walkablePath = await this.svgManager.getWalkableNodes(building, floor);

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
      // console.log(`testing (${current.value.x}, ${current.value.y})`)
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
    return [];
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
   * Allows for small missalignments in the nodes of the svg file
   */
  private inRange(x, y, tolerence) {
    return x >= y - tolerence && x <= y + tolerence;
  }

  /**
   * Checks if two nodes are close to eachother (so that the algo doesn't go through walls)
   *
   * @param a point A
   * @param b point B
   */
  private isClose(a: SVGCoordinate, b: SVGCoordinate) {
    return this.distance(a, b) < 20;
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
      if (
        // TODO: add a check for proximity (I'll add after making the hall svgs)
        (this.inRange(possibleNode.x, parentNode.value.x, 1) ||
          this.inRange(possibleNode.y, parentNode.value.y, 1))
        && this.isClose(possibleNode, parentNode.value)
      ) {
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
   * The distance from the current node and the start node
   */
  private g(currentNode: SVGCoordinate, startNode: SVGCoordinate) {
    return this.distance(currentNode, startNode);
  }

  /**
   * The Heuristic (distance from current node to end node)
   */
  private h(currentNode: SVGCoordinate, endNode: SVGCoordinate) {
    return this.distance(currentNode, endNode);
  }

  /**
   * Calculates the distance from A to B
   * @param a position node A
   * @param b  position node B
   */
  distance(a: SVGCoordinate, b: SVGCoordinate): number {
    if (typeof a.x === 'undefined' || typeof a.y === 'undefined' || typeof b.y === 'undefined' || typeof b.x === 'undefined') {
      return 0;
    } else {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }
  }
}
