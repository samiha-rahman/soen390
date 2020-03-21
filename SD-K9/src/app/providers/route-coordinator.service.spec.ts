import { TestBed } from '@angular/core/testing';

import { RouteCoordinator } from './route-coordinator.service';

describe('RouteCoordinatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteCoordinator = TestBed.get(RouteCoordinator);
    expect(service).toBeTruthy();
  });
});
