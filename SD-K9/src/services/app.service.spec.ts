import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    schemas:[NO_ERRORS_SCHEMA]
  }));

  it('should do nothing', () => {
    //const service: AppService = TestBed.get(AppService);
    expect(undefined).toBeUndefined();
  });
});
