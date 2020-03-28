import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutdoorMapComponent } from './outdoor-map.component';
import { BuildingInfoComponent } from '../building-info/building-info.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationMock } from '../../test-helpers/mock-geolocation';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OutdoorMapComponent', () => {
  let component: OutdoorMapComponent;
  let fixture: ComponentFixture<OutdoorMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ OutdoorMapComponent,BuildingInfoComponent ],
        imports: [IonicModule.forRoot(),BrowserAnimationsModule],
        providers: [
            {provide: Geolocation, useClass: GeolocationMock},
            OutdoorRouteBuilder
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(OutdoorMapComponent);
    component = fixture.componentInstance;
    component.data = {id: 1, building: 'hall', floor: 8};
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the map with user coordinates', () => {
    expect(component.mapInitialised).toBeTruthy();
  });

  it('should move the map when locating user', () => {
    //move map away from user
    component.toggleCampus({detail:{value:"sgw"}});

    let firstLat = component.map.getCenter().lat();

    //move to user
    component.currentPos = {"lat":60,"lng":-60};
    component.locateUser();

    //get new map center, it should have moved
    let secondLat = component.map.getCenter().lat();
    expect(firstLat).not.toEqual(secondLat);
  });

  it('should move the map when changing campus', () => {
    component.currentPos = {"lat":60,"lng":-60};

    //get map center when it opens
    let firstLat = component.map.getCenter().lat();

    //mock switching between campus
    component.toggleCampus({detail:{value:"sgw"}});

    //get new map center, it should have moved
    let secondLat = component.map.getCenter().lat();
    expect(firstLat).not.toEqual(secondLat);

  });

});
