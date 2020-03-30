import { TestBed, ComponentFixture } from '@angular/core/testing';

import { IndoorRouteCoordinator } from './indoor-route-coordinator.service';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { SVGManager } from './svg-manager.service';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { doesNotThrow } from 'assert';

describe('IndoorRouteCoordinatorService', () => {
  let service: IndoorRouteCoordinator;
  let svgCoordinate: SVGCoordinate;
  let spy: any;

  class MockRouteBuilder {
    async buildRoute(iInitialLocation: SVGCoordinate, iDestination: SVGCoordinate) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      {provide: IndoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
      {provide: OutdoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
      {provide: SVGManager, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
    ]
    }).compileComponents();
    service = TestBed.get(IndoorRouteCoordinator);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getIndoorRoute should call `generateRouteLocations` method for multiple floors', async() => {
    const coordinateA: SVGCoordinate = {
      id: 'H-815',
      building: 'hall',
      floor: 8,
      x: 103.205,
      y: 491.961
    }

    const coordinateB: SVGCoordinate = {
      id: 'H-631',
      building: 'hall',
      floor: 6,
      x: 79.622,
      y: 89.088
    }
    spy = spyOn(service, 'generateRouteLocations');
    service.getIndoorRoute(coordinateA, coordinateB);
    expect(spy).toHaveBeenCalled();
  });
});
