import { TestBed } from '@angular/core/testing';

import { IndoorMapBuilder } from './indoor-map-builder.service';
import { IndoorMapData } from '../data-models/indoor-map-data';

describe('IndoorMapBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            IndoorMapBuilder,
            IndoorMapData
        ]
    }).compileComponents()
  });

  it('should be created', () => {
    const service: IndoorMapBuilder = TestBed.get(IndoorMapBuilder);
    expect(service).toBeTruthy();
  });
});