import { TestBed } from '@angular/core/testing';

import { IndoorRouteBuilder } from './indoor-route-builder.service';
import { HttpClientModule } from '@angular/common/http';
import { Pathfinder } from './pathfinder.service';

describe('IndoorRouteBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        IndoorRouteBuilder,
        { provide: Pathfinder, useValue: { load: jasmine.createSpy('load').and.returnValue(new Promise(() => true)) } },
      ]
    }).compileComponents()
  });

  it('should be created', () => {
    const service: IndoorRouteBuilder = TestBed.get(IndoorRouteBuilder);
    expect(service).toBeTruthy();
  });
});