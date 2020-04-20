import { TestBed } from '@angular/core/testing';
import { QueuedRouteStore } from './queued-route-store.service';
import { QueuedRoute } from '../../interfaces/queued-route';

describe('QueuedRouteStore', () => {
  let service: QueuedRouteStore;

  beforeEach(() => {
      TestBed.configureTestingModule({})
      service = TestBed.get(QueuedRouteStore)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getQueuedRoute should return an existing route', () => {
    let route: QueuedRoute = {
        id:1,
        summary:"route",
        startTime: new Date(),
        endTime: new Date(),
        location: "Hall"
    }
    service.store(route);
    expect(service.getQueuedRoute(1).id).toEqual(1);
  })
});
