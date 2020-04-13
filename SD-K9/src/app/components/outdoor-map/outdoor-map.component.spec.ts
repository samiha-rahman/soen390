import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutdoorMapComponent } from './outdoor-map.component';
import { BuildingInfoComponent } from '../building-info/building-info.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationMock } from '../../test-helpers/mock-geolocation';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

declare var google;

describe('OutdoorMapComponent', () => {
  let component: OutdoorMapComponent;
  let fixture: ComponentFixture<OutdoorMapComponent>;

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

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

  it('#_initMap should initialize the map with user coordinates', (async() => {
    await delay(10000);

    expect(component.mapInitialised).toBeTruthy();
  }));

  it('#locateUser should move the map when locating user', (async() => {
    await delay(10000);

    //move map away from user
    component.toggleCampus({detail:{value:"sgw"}});

    let firstLat = component.map.getCenter().lat();

    //move to user
    component.currentPos = {"lat":60,"lng":-60};
    component.locateUser();

    //get new map center, it should have moved
    let secondLat = component.map.getCenter().lat();
    expect(firstLat).not.toEqual(secondLat);
  }));

  it('#toggleCampus should move the map when changing campus', (async() => {
    await delay(10000);

    component.currentPos = {"lat":60,"lng":-60};

    //get map center when it opens
    let firstLat = component.map.getCenter().lat();

    //mock switching between campus
    component.toggleCampus({detail:{value:"sgw"}});

    //get new map center, it should have moved
    let secondLat = component.map.getCenter().lat();
    expect(firstLat).not.toEqual(secondLat);

  }));

  it('#reverseGeocode should return correct address from coordinates', async() => {
    await delay(10000);

    let coords = { lat : 45.497061 , lng : -73.578802 }; //Concordia University's coordinates
    let address = '1455 Boulevard de Maisonneuve O, Montréal, QC H3G 1M8, Canada';
    component.reverseGeocode(coords, function(test){
      expect(address).toEqual(test);
    });
  });

  it('#clickToMark should place marker and open infoWindow', async() => {
    await delay(10000);

    let coords = { lat : 45.497061 , lng : -73.578802 };
    component.clickToMark(coords);
    expect(component.infowindow).toBeDefined();
    expect(component.clickMarker).toBeDefined();
  });

  it('#inCampus button should tell you are in campus', async() => {
    await delay(10000);
    const defaultButtonText = "You are not inside campus building";
    let coords = new google.maps.LatLng(60, -60);
    component.inCampus(coords);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#btn'));
    expect(button.nativeElement.textContent.trim()).toBe(defaultButtonText);
  });

  it('#inCampus button should tell you are in hall building', async() => {
    await delay(10000);
    const defaultButtonText = "You are in hall building";
    let coords = new google.maps.LatLng(45.497307, -73.578971);
    component.inCampus(coords);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#btn'));
    expect(button.nativeElement.textContent.trim()).toBe(defaultButtonText);
  });

});
