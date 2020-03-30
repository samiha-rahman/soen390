import { TestBed } from '@angular/core/testing';

import { BuildingInfoStore } from './building-info-store.service';

describe('BuildingInfoStore', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildingInfoStore = TestBed.get(BuildingInfoStore);
    expect(service).toBeTruthy();
  });
});
