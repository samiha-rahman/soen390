import { TestBed } from '@angular/core/testing';

import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { Location } from '../helpers/location';

describe('OutdoorRouteBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            OutdoorRouteBuilder,
            Location
        ]
    }).compileComponents();
});

  it('should be created', () => {
    const service: OutdoorRouteBuilder = TestBed.get(OutdoorRouteBuilder);
    expect(service).toBeTruthy();
  });
});