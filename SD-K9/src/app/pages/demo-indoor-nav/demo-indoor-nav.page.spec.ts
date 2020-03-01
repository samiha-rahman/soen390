import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoIndoorNavPage } from './demo-indoor-nav.page';

describe('DemoIndoorNavPage', () => {
  let component: DemoIndoorNavPage;
  let fixture: ComponentFixture<DemoIndoorNavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoIndoorNavPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoIndoorNavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
