import { TestBed } from '@angular/core/testing';

import { MapModeStore } from './map-mode-store.service';

describe('MapModeStore', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapModeStore = TestBed.get(MapModeStore);
    expect(service).toBeTruthy();
  });
});
