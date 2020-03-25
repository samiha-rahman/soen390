import { TestBed } from '@angular/core/testing';

import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { Location } from '../helpers/location';
import { HttpClientModule } from '@angular/common/http';

declare var google;

describe('OutdoorRouteBuilder', () => {
  let service: OutdoorRouteBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OutdoorRouteBuilder,
        Location
      ]
    }).compileComponents();

    service = TestBed.get(OutdoorRouteBuilder);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});