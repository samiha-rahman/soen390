import { TestBed } from '@angular/core/testing';

import { MapCoordinator } from './map-coordinator.service';
import { HttpClientModule } from '@angular/common/http';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { Pathfinder } from './pathfinder.service';

describe('MapCoordinator', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          {provide: IndoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
          {provide: Pathfinder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
        ]
    }).compileComponents();
});

  it('should be created', () => {
    const service: MapCoordinator = TestBed.get(MapCoordinator);
    expect(service).toBeTruthy();
  });
});
