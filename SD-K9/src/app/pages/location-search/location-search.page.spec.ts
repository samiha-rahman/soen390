import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { LocationSearchPage } from './location-search.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationMock } from '../../test-helpers/mock-geolocation';

describe('LocationSearchPage', () => {
  let component: LocationSearchPage;
  let fixture: ComponentFixture<LocationSearchPage>;

  class NavControllerMock {
    public navigateBack(page: string) {
      return {
        'instance': {
          'model': 'something',
        }
      }
    }
  }

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSearchPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavControllerMock},
        { provide: ActivatedRoute, useValue: { queryParams: of({ query: 'start' })} },
        { provide: Geolocation, useClass: GeolocationMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  }));

  it('should create', async() => {
    await delay(10000);

    expect(component).toBeTruthy();
  });

  it('#enterQuery should call `navigateBack` function of `NavController`', async() => {
    await delay(10000);

    let nav = fixture.debugElement.injector.get(NavController);
    spyOn(nav, 'navigateBack').withArgs("home");

    component.enterQuery('H-815')
    expect(nav.navigateBack).toHaveBeenCalledWith("home");
  });

  // it('#changeQuery should filter elements in `itemList`', (async() => {
  //   await delay(10000);

  //   component.changeQuery('H-815')
  //   expect(component.itemList.length).toEqual(1);
  // }));

  it('#moveMap should move the map to searched address', async() => {
    await delay(10000);
    let address = '1455 Boulevard de Maisonneuve O, Montréal, QC H3G 1M8';
    let addressLat = '45.497061'; //taken from Geocoding API website

    component.moveMap(address);
    let newLat = component.map.getCenter().lat();

    expect(addressLat).toEqual(newLat);
  });

});
