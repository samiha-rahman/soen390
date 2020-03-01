import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { IonicPullupModule, IonPullUpFooterState } from 'ionic-pullup';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';
import { HttpClientModule } from '@angular/common/http';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage, FloorPlanComponent],
      imports: [IonicModule.forRoot(), FormsModule, IonicPullupModule, HttpClientModule],
      providers: [{ provide: MapCoordinator, useValue: { load: jasmine.createSpy('load').and.returnValue(new Promise(() => true)) } }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find building from class ID', () => {
    const id1 = 'H-625';
    const id2 = 'CC-312';
    const building1 = component.parseBuilding(id1);
    expect(building1).toEqual('hall');
    const building2 = component.parseBuilding(id2);
    expect(building2).toEqual('loyola');
  });

  it('should find floor from class ID', () => {
    const id1 = 'H-625';
    const id2 = 'H-1025';
    const floor1 = component.parseFloor(id1);
    expect(floor1).toEqual(6);
    const floor2 = component.parseFloor(id2);
    expect(floor2).toEqual(10);
  });
});
