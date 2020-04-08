import { TestBed } from '@angular/core/testing';

import { MapCoordinator } from './map-coordinator.service';
import { HttpClientModule } from '@angular/common/http';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { Pathfinder } from './pathfinder.service';
import { SVGManager } from './svg-manager.service';
import { RouteStore } from './state-stores/route-store.service';
import { FloorPlanStore } from './state-stores/floor-plan-store.service';
import { IndoorRouteCoordinator } from './indoor-route-coordinator.service';
import { DirectionForm } from '../interfaces/direction-form';
import { Transport } from '../models/transport.enum.model';
import { VerticalTransport } from '../models/vertical-transport.enum.model';

describe('MapCoordinator', () => {
  let service: MapCoordinator;

  class OutdoorRouteBuilderMock {
    clearRoute() {}
    buildRoute() {}
  }

  class RouteStoreMock {
    clearRoutes() {}
    storeRoute() {}
  }

  class FloorPlanStoreMock {
    clearFloorPlans() {}
  }

  class SVGManagerMock {
    getSVGCoordFromID() {}
    getClosestVerticalTransportationId() {}
  }

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          {provide: OutdoorRouteBuilder, useClass: OutdoorRouteBuilderMock},
          {provide: Pathfinder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: SVGManager, useClass: SVGManagerMock},
          {provide: RouteStore, useClass: RouteStoreMock},
          {provide: FloorPlanStore, useClass: FloorPlanStoreMock},
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
    let directionForm: DirectionForm = {
      sourceDestination: {source: 'H-815', destination: 'CC-101'},
      transport: Transport.DRIVING,
      verticalTransport: VerticalTransport.ELEVATORS
    }

    let maps = await service.getOverallRoute(directionForm);
    expect(maps.length).toEqual(4);
  });

});
