import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SVGManager } from './svg-manager.service';
import { SVGCoordinate } from '../models/svg-coordinate.model';

describe('SVGManager', () => {
    let service: SVGManager;
    let httpMock: HttpTestingController;

    const dummySVG = `<svg version="1.1" x="0px" y="0px" viewBox="0 0 10 10">
    <g id="nodes">
    <circle class="node" cx="8" cy="2" r="0.5"/>
    <circle class="node" cx="2" cy="8" r="0.5"/>
    </g>
    <g id="classes">
    <circle class="classroom" id="A" cx="2" cy="2" r="0.5"/>
    <circle class="classroom" id="B" cx="8" cy="8" r="0.5"/>
    </g>
    <g id="stairs">
    <circle id="stair-1" cx="5" cy="5" r="0.5"/>
    <circle id="stair-2" cx="5" cy="2" r="0.5"/>
    </g>
    <g id="escalators">
    <g id="up">
    <circle id="up-escalator-1" cx="5" cy="5" r="0.5"/>
    <circle id="up-escalator-2" cx="8" cy="8" r="0.5"/>
    </g>
    </g>
    </svg>`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SVGManager
            ]
        }).compileComponents();
        service = TestBed.get(SVGManager);
        httpMock = TestBed.get(HttpTestingController);
        spyOn(service, 'drawSVGPath').and.callThrough();
    });

    afterEach(() => {
        service = null;
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getSVG should get SVG from assets', () => {

        service.getSVG('any/0').subscribe(floorplan => {
            expect(floorplan).toEqual(dummySVG);
        });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });

    it('#getWalkableNodes should return a list of walkable nodes from the svg', () => {
        const building = 'any';
        const floor = 0;

        const expectedNodes = [
            { id: '', building, floor, x: 8, y: 2 },
            { id: '', building, floor, x: 2, y: 8 }
        ];

        service.getWalkableNodes(building, floor)
            .then(nodes => {
                expect(nodes.length).toEqual(2);
                expect(nodes).toEqual(expectedNodes);
            })
            .catch((error) => {
                fail(error);
            });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });

    it('#getClassroom should return a classroom given an id', () => {
        const classID = 'A';
        const building = 'any';
        const floor = 0;

        const expectedClassroom = {
            id: 'A',
            building,
            floor,
            x: 2,
            y: 2
        }

        service.getClassroom(classID, building, floor)
            .then(classroom => {
                expect(classroom).toEqual(expectedClassroom);
            })
            .catch((error) => {
                fail(error);
            });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });

    it('#getClassroom should return a classroom given an id', () => {
        const classID = 'A';
        const building = 'any';
        const floor = 0;

        const expectedClassroom = {
            id: 'A',
            building,
            floor,
            x: 2,
            y: 2
        }

        service.getClassroom(classID, building, floor)
            .then(classroom => {
                expect(classroom).toEqual(expectedClassroom);
            })
            .catch((error) => {
                fail(error);
            });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });

    it('#getVerticalTransportation should return a vertical transportation given an id', () => {
        const vtID = 'stair-1';
        const building = 'any';
        const floor = 0;

        const expectedVerticalTransport = {
            id: 'stair-1',
            building,
            floor,
            x: 5,
            y: 5
        }

        service.getVerticalTransportation(vtID, 'stairs', building, floor)
            .then(vt => {
                expect(vt).toEqual(expectedVerticalTransport);
            })
            .catch((error) => {
                fail(error);
            });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });

    it('#getVerticalTransportationId should return the ID of the closest vt (stairs)', () => {
        const building = 'any';
        const floor = 0;
        const currentLocation: SVGCoordinate = { id: 'A', building, floor, x: 2, y: 2 };

        const expectedVerticalTransport = 'stair-2';

        service.getClosestVerticalTransportationId('stairs', 'up', building, floor, currentLocation)
            .then(vt => {
                expect(vt).toEqual(expectedVerticalTransport);
            })
            .catch((error) => {
                fail(error);
            });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });

    it('#getVerticalTransportationId should return the ID of the closest vt (escalator)', () => {
        const building = 'any';
        const floor = 0;
        const currentLocation: SVGCoordinate = { id: 'A', building, floor, x: 2, y: 2 };

        const expectedVerticalTransport = 'up-escalator-1';

        service.getClosestVerticalTransportationId('escalators', 'up', building, floor, currentLocation)
            .then(vt => {
                expect(vt).toEqual(expectedVerticalTransport);
            })
            .catch((error) => {
                fail(error);
            });

        const request = httpMock.expectOne('../../assets/any/0.svg');
        expect(request.request.method).toBe('GET');

        request.flush(dummySVG);
    });
});
