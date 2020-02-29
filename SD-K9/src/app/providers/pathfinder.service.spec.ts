import { TestBed } from '@angular/core/testing';

import { Location } from '../helpers/location';
import { Pathfinder } from './pathfinder.service';
import { HttpClientModule } from '@angular/common/http';
import { SVGCoordinate } from '../interfaces/svg-coordinate.model';

describe('Pathfinder', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                Pathfinder,
                Location
            ]
        }).compileComponents();
    });

    it('should be created', () => {
        const service: Pathfinder = TestBed.get(Pathfinder);
        expect(service).toBeTruthy();
    });

    it('should get distance between 2 nodes', () => {
        const service: Pathfinder = TestBed.get(Pathfinder);
        const nodeA: SVGCoordinate = {
            id: 'A',
            building: 'test',
            floor: 1,
            x: 0,
            y: 0,
        };
        const nodeB: SVGCoordinate = {
            id: 'B',
            building: 'test',
            floor: 1,
            x: 3,
            y: 4,
        };
        const dist = service.distance(nodeA, nodeB);

        expect(dist).toEqual(5); // sqrt(3^2 + 4^2) = 5
    });
});