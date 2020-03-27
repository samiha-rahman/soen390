import { TestBed } from '@angular/core/testing';

import { Pathfinder } from './pathfinder.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { SVGManager } from './svg-manager.service';

/* There are many methods in the pathfinder service that are not tested directly because 
* they are private helper methods.
*/
describe('Pathfinder', () => {
    let service: Pathfinder;
    const mockSVGManager: any = {
        getWalkableNodes: () => {
            return [
                { id: 'A', x: 2, y: 2, building: 'na', floor: 0 },
                { id: 'node-1', x: 5, y: 2, building: 'na', floor: 0 },
                { id: 'node-2', x: 8, y: 2, building: 'na', floor: 0 },
                { id: 'node-3', x: 2, y: 5, building: 'na', floor: 0 },
                { id: 'node-4', x: 5, y: 5, building: 'na', floor: 0 },
                { id: 'node-5', x: 8, y: 5, building: 'na', floor: 0 },
                { id: 'node-6', x: 2, y: 8, building: 'na', floor: 0 },
                { id: 'node-7', x: 5, y: 8, building: 'na', floor: 0 },
                { id: 'B', x: 8, y: 8, building: 'na', floor: 0 }
            ];
        }
    };

    const nodeA: SVGCoordinate = {
        id: 'A',
        building: 'na',
        floor: 0,
        x: 2,
        y: 2,
    };

    const nodeB: SVGCoordinate = {
        id: 'B',
        building: 'na',
        floor: 0,
        x: 8,
        y: 8,
    };

    /* The walkable nodes look like the following,
        where the shortest path would be the coordinates marked by *

    (2,2)* (5,2) (8,2)
    (2,5) (5,5)* (8,5)
    (2,8) (5,8) (8,8)*

    */

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                Pathfinder,
                { provide: SVGManager, useValue: mockSVGManager }
            ]
        }).compileComponents();
        service = TestBed.get(Pathfinder);
    });

    afterEach(() => {
        service = null;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getShortestPath should get the shortest path between 2 indoor locations', async () => {

        const middleNode: SVGCoordinate = {
            id: 'node-4',
            building: 'na',
            floor: 0,
            x: 5,
            y: 5
        };

        const path = await service.getShortestPath(nodeA, nodeB);

        expect(path.length).toEqual(3);
        expect(path).toEqual([nodeA, middleNode, nodeB]);
    });

    it('#getShortestPath should return an error if not on the same floor', async() => {
        const newNodeA = JSON.parse(JSON.stringify(nodeA));
        newNodeA.floor = 1;

        expectAsync(service.getShortestPath(newNodeA, nodeB)).toBeRejectedWith(new Error('The start and end points should be in the same floor of the same building.'));
    });

    it('#distance should get distance between 2 nodes', () => {

        const dist = service.distance(nodeA, nodeB);
        const eucledianDistance = Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2))

        // sqrt((2-8)^2 + (2-8)^2) = 8.485
        expect(dist.toFixed(2)).toEqual(eucledianDistance.toFixed(2));
    });
});
