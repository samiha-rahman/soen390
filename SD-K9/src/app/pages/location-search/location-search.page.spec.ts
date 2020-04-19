import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { LocationSearchPage } from './location-search.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LocationSearchPage', () => {
  let component: LocationSearchPage;
  let fixture: ComponentFixture<LocationSearchPage>;

  class OutdoorRouteBuilderMock {
    clearRoute() { }
    buildRoute() { }
  }

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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSearchPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: ActivatedRoute, useValue: { queryParams: of({ query: 'start' }) } },
        { provide: OutdoorRouteBuilder, useClass: OutdoorRouteBuilderMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('#changeQuery should filter elements in `itemList`', () => {
    component.query = 'H-811';
    component.changeQuery()
    expect(component.itemList.length).toEqual(1);
  });

});
