import { TestBed } from '@angular/core/testing';

import { MapCoordinator } from './map-coordinator.service';
import { HttpClientModule } from '@angular/common/http';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { Pathfinder } from './pathfinder.service';
import { SVGManager } from './svg-manager.service';
import { RouteStore } from './state-stores/route-store.service';
import { FloorPlanStore } from './state-stores/floor-plan-store.service';
import { IndoorRouteCoordinator } from './indoor-route-coordinator.service';
import { MapItem } from '../helpers/map-item';
import {SourceDestination} from '../interfaces/source-destination';

describe('MapCoordinator', () => {
  let service: MapCoordinator;

  class OutdoorRouteBuilderMock {
    clearRoute() {}
  }

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          {provide: OutdoorRouteBuilder, useClass: OutdoorRouteBuilderMock, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: Pathfinder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: SVGManager, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: RouteStore, useClass: OutdoorRouteBuilderMock, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: FloorPlanStore, useClass: OutdoorRouteBuilderMock, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: IndoorRouteCoordinator, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}}
        ]
    }).compileComponents();
    service = TestBed.get(MapCoordinator);
});

afterEach(() => {
  service = null;
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getOverallRoutes should return 4 MapItem when requested for H-815 to CC-101', async () => {
    let sourceDestination: SourceDestination = {
      source: 'H-815',
      destination: 'CC-101'
    };

    let maps = await service.getOverallRoute(sourceDestination);
    expect(maps.length).toEqual(4);
  });

});
