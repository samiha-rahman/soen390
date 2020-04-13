import { TestBed } from '@angular/core/testing';

import { SQLiteQueuedRoutes } from './queued-routes.sqlite.service';

describe('SqliteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SQLiteQueuedRoutes = TestBed.get(SQLiteQueuedRoutes);
    expect(service).toBeTruthy();
  });
});
