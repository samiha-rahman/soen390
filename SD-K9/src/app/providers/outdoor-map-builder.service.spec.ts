import { TestBed } from '@angular/core/testing';

import { OutdoorMapBuilder } from './outdoor-map-builder.service';
import { OutdoorMapData } from '../data-models/outdoor-map-data';

describe('OutdoorMapBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            OutdoorMapBuilder,
            OutdoorMapData
        ]
    }).compileComponents();
  });

  it('should be created', () => {
    const service: OutdoorMapBuilder = TestBed.get(OutdoorMapBuilder);
    expect(service).toBeTruthy();
  });
});