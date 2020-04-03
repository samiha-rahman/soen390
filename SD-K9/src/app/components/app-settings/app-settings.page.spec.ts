import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppSettings } from './app-settings.page';

describe('AppsettingsPage', () => {
  let component: AppSettings;
  let fixture: ComponentFixture<AppSettings>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSettings ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
