import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppsettingsPage } from './appsettings.page';

describe('AppsettingsPage', () => {
  let component: AppsettingsPage;
  let fixture: ComponentFixture<AppsettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppsettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppsettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
