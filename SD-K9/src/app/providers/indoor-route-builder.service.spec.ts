import { TestBed } from '@angular/core/testing';

import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { Location } from '../helpers/location'

describe('IndoorRouteBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            IndoorRouteBuilder,
            Location
        ]
    }).compileComponents()
  });

  it('should be created', () => {
    const service: IndoorRouteBuilder = TestBed.get(IndoorRouteBuilder);
    expect(service).toBeTruthy();
  });
});