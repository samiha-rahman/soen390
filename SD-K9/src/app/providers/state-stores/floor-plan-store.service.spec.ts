import { TestBed } from '@angular/core/testing';

import { FloorPlanStore } from './floor-plan-store.service';
import { FloorPlanIdentifier } from 'src/app/interfaces/floor-plan-identifier';

describe('FloorPlanStoreService', () => {
  let service: FloorPlanStore

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(FloorPlanStore);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getFloorPlan should return an existing `FloorPlanIdentifier`', () => {
    let fpi: FloorPlanIdentifier = {
      id: 1,
      floor: 8,
      building: ''
    }
    service.storeFloorPlan(fpi);
    expect(service.getFloorPlan(1).id).toEqual(1);
  });
});
