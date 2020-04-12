import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { LocationSearchPage } from './location-search.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
        { provide: ActivatedRoute, useValue: { queryParams: of({ query: 'start' })} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#enterQuery should call `navigateBack` function of `NavController`', () => {
    let nav = fixture.debugElement.injector.get(NavController);
    spyOn(nav, 'navigateBack').withArgs("home");

    component.enterQuery('H-815')
    expect(nav.navigateBack).toHaveBeenCalledWith("home");
  });

  it('#changeQuery should filter elements in `itemList`', async() => {
    await delay(10000);

    component.query = 'H-811';
    component.changeQuery()
    expect(component.itemList.length).toEqual(1);
  });

});
