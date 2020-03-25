import { TestBed } from '@angular/core/testing';

import { Location } from '../helpers/location';
import { Pathfinder } from './pathfinder.service';
import { HttpClientModule } from '@angular/common/http';
import { SVGCoordinate } from '../models/svg-coordinate.model';

describe('Pathfinder', () => {
    let service: Pathfinder;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                Pathfinder,
                Location
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

    it('#distance should get distance between 2 nodes', () => {
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