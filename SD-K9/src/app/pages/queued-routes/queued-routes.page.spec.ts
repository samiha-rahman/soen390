import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QueuedRoutesPage } from './queued-routes.page';

describe('QueuedRoutesPage', () => {
  let component: QueuedRoutesPage;
  let fixture: ComponentFixture<QueuedRoutesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuedRoutesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QueuedRoutesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
