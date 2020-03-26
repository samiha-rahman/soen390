import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FloorPlanComponent } from './floor-plan.component';
import { HttpClientModule } from '@angular/common/http';
import { SVGManager } from 'src/app/providers/svg-manager.service';
import { RouteCoordinator } from 'src/app/providers/route-coordinator.service';
import { FloorPlanStore } from 'src/app/providers/state-stores/floor-plan-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { doesNotThrow } from 'assert';

describe('FloorPlanComponent', () => {
  let component: FloorPlanComponent;
  let fixture: ComponentFixture<FloorPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FloorPlanComponent],
      imports: [IonicModule.forRoot(), HttpClientModule],
      providers: [
        SVGManager,
        FloorPlanStore,
        RouteStore,
        {provide: RouteCoordinator, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FloorPlanComponent);
    component = fixture.componentInstance;
    component.data = {id: 1, building: 'hall', floor: 8};
    fixture.detectChanges();
  }));

  it('should create', () => {
    jasmine.createSpyObj('routeStore', [RouteStore]);
    jasmine.createSpyObj('svgManager', [SVGManager]);
    expect(component).toBeTruthy();
  });
});
