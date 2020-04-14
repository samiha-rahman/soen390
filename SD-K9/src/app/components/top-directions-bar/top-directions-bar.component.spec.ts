import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonSearchbar, IonBackButton, IonButton, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonHeader, NavController } from '@ionic/angular';

import { TopDirectionsBarComponent } from './top-directions-bar.component';
import { FormsModule } from '@angular/forms';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { Transport } from 'src/app/models/transport.enum.model';
import { VerticalTransport } from 'src/app/models/vertical-transport.enum.model';


fdescribe('TopDirectionsBarComponent', () => {
  let component: TopDirectionsBarComponent;
  let fixture: ComponentFixture<TopDirectionsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TopDirectionsBarComponent,
        /* Exception because IonSearchbar cannot be declared in both IonicModule and DynamicTestingModule */
        IonSearchbar,
        IonBackButton,
        IonButtons,
        IonButton,
        IonIcon,
        IonGrid,
        IonRow,
        IonCol,
        IonSegment,
        IonSegmentButton,
        IonLabel,
        IonToolbar,
        IonHeader
      ],
      imports: [FormsModule],
      providers: [
        { provide: NavController, useValue: { load: jasmine.createSpy('load').and.returnValue(new Promise(() => true)) } },
        DirectionFormStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopDirectionsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("#transportSegmentChanged should call `sendDirection()` whenever a trasnport mode is selected from ui", () => {
    /* prepare DirectionForm */
    component.start = 'h-815';
    component.end = 'h-816';
    component.transport = Transport.TRANSIT;

    component.directionSent = true;
    let event: Event = new CustomEvent("ion-segment", {
      detail: {
        value: "WALKING",
      }
    });

    spyOn(component, 'sendDirection');
    component.transportSegmentChanged(event);
    expect(component.sendDirection).toHaveBeenCalled();
  });

  it('#sendDirection should send `true` with the `EventEmmitter`: `formCompleteEvent` when `DirectionForm`  is complete', () => {
    /* prepare DirectionForm */
    component.start = 'h-815';
    component.end = 'h-816';
    component.transport = Transport.TRANSIT;

    spyOn(component.formCompleteEvent, 'emit');
    component.sendDirection();
    expect(component.formCompleteEvent.emit).toHaveBeenCalledWith(true);
  });

  it('#clearDirection should send `false` with the `EventEmmitter`: `formCompleteEvent`', () => {
    spyOn(component.formCompleteEvent, 'emit');
    component.clearDirection();
    expect(component.formCompleteEvent.emit).toHaveBeenCalledWith(false);
  });

  it('#expandBar should expand the bar', () => {
    spyOn(component.formCompleteEvent, 'emit');
    component.expandBar();
    expect(component.isExpanded).toBeTruthy();
    expect(component.formCompleteEvent.emit).toHaveBeenCalledWith(false);
  });

  it('#startRoute should contract the bar', () => {
    component.startRoute();
    expect(component.isExpanded).toBeFalsy();
  });

  it('#verticalTransportSegmentChanged should change the vertical transport method', () => {
    component.verticalTransportSegmentChanged(VerticalTransport.STAIRS);
    expect(component.verticalTransport).toEqual(VerticalTransport.STAIRS);
  });


});
