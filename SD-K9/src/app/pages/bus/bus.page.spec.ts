import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusPage } from './bus.page';

describe('BusPage', () => {
  let component: BusPage;
  let fixture: ComponentFixture<BusPage>;

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#sgwSchedule should display all items in sgw schedule', (async() => {
    component.read_json_sgw;
    await delay(1000);
    expect(component.scheduleDataSGW.length).toEqual(27);
  }));

  it('#loySchedule should display all items in loyola schedule', (async() => {
    component.read_json_loyola;
    await delay(1000);
    expect(component.scheduleDataLoy.length).toEqual(28);
  }));


});
