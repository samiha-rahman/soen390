import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { QueuedRoutePage } from './queued-route.page';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { DebugElement } from '@angular/core';

describe('QueuedRoutePage', () => {
  let component: QueuedRoutePage;
  let fixture: ComponentFixture<QueuedRoutePage>; 
  let debugElement: DebugElement;

  class DirectionFormStoreMock { setDestination(location: string) { } }
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuedRoutePage ],
      imports: [IonicModule.forRoot()],
      providers: [DirectionFormStore]
    }).compileComponents();

    fixture = TestBed.createComponent(QueuedRoutePage);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#nextClass should set next class', () => {
    let directionFormStore = debugElement.injector.get(DirectionFormStore)
    spyOn(directionFormStore, 'setDestination');
    component.nextClass({location:'Hall'});
    expect(directionFormStore.setDestination).toHaveBeenCalledWith('Hall');
  })
});
