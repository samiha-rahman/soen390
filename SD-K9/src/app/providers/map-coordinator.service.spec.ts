import { TestBed } from '@angular/core/testing';

import { MapCoordinator } from './map-coordinator.service';
import { HallBuildingData } from '../data-models/hall-building-data';
import { LoyolaCampusData } from '../data-models/loyola-campus-data';
import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { IndoorMapBuilder } from './indoor-map-builder.service';
import { OutdoorMapBuilder } from './outdoor-map-builder.service';
import { IndoorMapData } from '../data-models/indoor-map-data';

describe('MapCoordinator', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
            {provide: HallBuildingData, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
            {provide: LoyolaCampusData, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
            {provide: IndoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
            {provide: OutdoorRouteBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
            {provide: IndoorMapBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
            {provide: OutdoorMapBuilder, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
            {provide: IndoorMapData, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}}
        ]
    }).compileComponents();
});

  it('should be created', () => {
    const service: MapCoordinator = TestBed.get(MapCoordinator);
    expect(service).toBeTruthy();
  });
});