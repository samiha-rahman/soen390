import { TestBed } from '@angular/core/testing';

import { FloorPlanStore } from './floor-plan-store.service';

describe('FloorPlanStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FloorPlanStore = TestBed.get(FloorPlanStore);
    expect(service).toBeTruthy();
  });
});
