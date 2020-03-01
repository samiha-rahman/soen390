import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TempIndoorPagePage } from './temp-indoor-page.page';

describe('TempIndoorPagePage', () => {
  let component: TempIndoorPagePage;
  let fixture: ComponentFixture<TempIndoorPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempIndoorPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TempIndoorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
