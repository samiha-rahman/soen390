import { TestBed } from '@angular/core/testing';

import { GoogleStore } from './google-store.service';

describe('GoogleStore', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleStore = TestBed.get(GoogleStore);
    expect(service).toBeTruthy();
  });
});
