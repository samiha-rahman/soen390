import { TestBed } from '@angular/core/testing';

import { GoogleStore } from './google-store.service';

describe('GoogleStore', () => {
  let service: GoogleStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GoogleStore);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
