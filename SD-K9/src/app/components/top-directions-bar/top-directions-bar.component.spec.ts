import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonSearchbar, IonBackButton, IonButton, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonHeader, NavController } from '@ionic/angular';

import { TopDirectionsBarComponent } from './top-directions-bar.component';
import { FormsModule } from '@angular/forms';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { Observable } from 'rxjs';

describe('TopDirectionsBarComponent', () => {
  let component: TopDirectionsBarComponent;
  let fixture: ComponentFixture<TopDirectionsBarComponent>;
  let observable = new Observable<any>();

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
        { provide: DirectionFormStore, useValue: observable }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopDirectionsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
