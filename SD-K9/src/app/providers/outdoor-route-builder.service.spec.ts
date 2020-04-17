import { TestBed } from '@angular/core/testing';

import { OutdoorRouteBuilder } from './outdoor-route-builder.service';
import { DirectionForm } from '../interfaces/direction-form';
import { Transport } from '../models/transport.enum.model';
import { VerticalTransport } from '../models/vertical-transport.enum.model';
import { GoogleStore } from 'src/app/providers/state-stores/google-store.service';

declare var google;

describe('OutdoorRouteBuilder', () => {
  let service: OutdoorRouteBuilder;

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }



  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OutdoorRouteBuilder,
      ]
    }).compileComponents();

    service = TestBed.get(OutdoorRouteBuilder);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#shuttleService travelmode from sgw to loy should be driving for shuttle option', (async() => {
    let loyShuttle = "45.458424,-73.638369";
    let hallShuttle = "45.497163,-73.578535";
    let directionForm: DirectionForm = {
      sourceDestination: {source: '45.497304, -73.578326', destination: 'h4b1r6'},
      transport: Transport.SHUTTLE,
      verticalTransport: VerticalTransport.ESCALATORS
    }
    let waypoints = [
      {location: hallShuttle, stopover: true},
      {location: loyShuttle, stopover: true}
    ];
    service.shuttleService(directionForm);

    expect(service.transportWay).toEqual('DRIVING');
    expect(service.waypts).toEqual(waypoints);
  }));

  it('#shuttleService travelmode from loy to sgw should be driving for shuttle option', (async() => {
    let loyShuttle = "45.458424,-73.638369";
    let directionForm: DirectionForm = {
      sourceDestination: {source: 'h4b1r6', destination: '45.497304, -73.578326'},
      transport: Transport.SHUTTLE,
      verticalTransport: VerticalTransport.ESCALATORS
    }
    let waypoints = [
      {location: loyShuttle, stopover: true}
    ];
    service.shuttleService(directionForm);

    expect(service.transportWay).toEqual('DRIVING');
    expect(service.waypts).toEqual(waypoints);
  }));

  it('#shuttleService travelmode for other directions should be transit for shuttle option', (async() => {
    let directionForm: DirectionForm = {
      sourceDestination: {source: 'H4R0B8', destination: '45.497304, -73.578326'},
      transport: Transport.SHUTTLE,
      verticalTransport: VerticalTransport.ESCALATORS
    }
    let waypoints =  null;
    service.shuttleService(directionForm);

    expect(service.transportWay).toEqual('TRANSIT');
    expect(service.waypts).toEqual(waypoints);
  }));

  it('#shuttleService travelmode for other directions should be any for any option', (async() => {
    let directionForm: DirectionForm = {
      sourceDestination: {source: 'H4R0B8', destination: '45.497304, -73.578326'},
      transport: Transport.DRIVING,
      verticalTransport: VerticalTransport.ESCALATORS
    }
    let waypoints =  null;
    service.shuttleService(directionForm);

    expect(service.transportWay).toEqual('DRIVING');
    expect(service.waypts).toEqual(waypoints);
  }));
});