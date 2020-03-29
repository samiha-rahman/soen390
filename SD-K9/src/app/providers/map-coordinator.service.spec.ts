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

describe('MapCoordinator', () => {
  let service: MapCoordinator;
  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          {provide: OutdoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: Pathfinder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: SVGManager, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: RouteStore, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: FloorPlanStore, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
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
});
