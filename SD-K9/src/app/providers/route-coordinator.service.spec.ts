import { TestBed, ComponentFixture } from '@angular/core/testing';

import { RouteCoordinator } from './route-coordinator.service';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { SVGManager } from './svg-manager.service';
import { Location } from '../helpers/location';
import { SVGCoordinate } from '../models/svg-coordinate.model';
import { RouteNavigator } from '../helpers/route-navigator';
import { loadavg } from 'os';

describe('RouteCoordinatorService', () => {
  let service: RouteCoordinator;
  let location: Location;
  let spy: any;
  let routeNavigator: RouteNavigator;

  class MockRouteBuilder {
    async buildRoute(iInitialLocation: Location, iDestination: Location) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      {provide: IndoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
      {provide: OutdoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
      {provide: SVGManager, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
    ]
    }).compileComponents();
    service = TestBed.get(RouteCoordinator);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getIndoorRoute should call `getCoordinate` method of `Location`', () => {
    const coordinate: SVGCoordinate = {
      id: 'H-815',
      building: 'hall',
      floor: 8,
      x: 103.205,
      y: 491.961
    }
    location = new Location();
    spy = spyOn(location, 'getCoordinate').and.returnValue(coordinate);
    
    service.getIndoorRoute(location, location);
    expect(spy).toHaveBeenCalled();
  });
});
