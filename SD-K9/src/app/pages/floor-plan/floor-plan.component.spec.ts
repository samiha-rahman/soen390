import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FloorPlanComponent } from './floor-plan.component';

describe('FloorPlanComponent', () => {
  let component: FloorPlanComponent;
  let fixture: ComponentFixture<FloorPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorPlanComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
