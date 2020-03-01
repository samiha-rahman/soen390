import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusPage } from './bus.page';

describe('BusPage', () => {
  let component: BusPage;
  let fixture: ComponentFixture<BusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
