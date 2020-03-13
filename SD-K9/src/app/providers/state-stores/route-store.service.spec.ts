import { TestBed } from '@angular/core/testing';

import { RouteStore } from './route-store.service';

describe('RouteStore', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteStore = TestBed.get(RouteStore);
    expect(service).toBeTruthy();
  });
});
