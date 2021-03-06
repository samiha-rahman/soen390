import { TestBed } from '@angular/core/testing';

import { RouteStore } from './route-store.service';
import { StateStore } from 'src/app/helpers/state-store';
import { RouteState } from 'src/app/interfaces/states/route-state';
import { Route } from '../../interfaces/route';
import { RouteType } from 'src/app/models/route-type.enum.model';
import { StateReducer } from 'src/app/interfaces/states/state-reducer';
import { StateAction } from 'src/app/interfaces/states/state-action';

describe('RouteStore', () => {
  let service: RouteStore;
  let stateStore: StateStore<RouteState>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(RouteStore);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getRoute should return an existing route', () => {
    let route: Route = {
      id: 1,
      route: '',
      type: RouteType.OUTDOOR
    }
    service.storeRoute(route);
    expect(service.getRoute(1).id).toEqual(1);
  })
});
