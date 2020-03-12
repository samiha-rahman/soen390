import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, IonSearchbar } from '@ionic/angular';

import { TopDirectionsBarComponent } from './top-directions-bar.component';

describe('TopDirectionsBarComponent', () => {
  let component: TopDirectionsBarComponent;
  let fixture: ComponentFixture<TopDirectionsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopDirectionsBarComponent, IonSearchbar],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopDirectionsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
