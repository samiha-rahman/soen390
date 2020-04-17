import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';

import { QueuedRoutePage } from './queued-route.page';
import { delay } from 'rxjs/operators';

class QueuedRouteServiceMock {
  nextClass(){
    return "H-815"
  }
}

describe('QueuedRoutePage', () => {
  let component: QueuedRoutePage;
  let fixture: ComponentFixture<QueuedRoutePage>;
  let queuedRouteMock = jasmine.createSpyObj('queuedRoute', ['nextClass']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuedRoutePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QueuedRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
