import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { DemoIndoorNavPage } from './demo-indoor-nav.page';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { IonicPullupModule, IonPullUpFooterState } from 'ionic-pullup';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';
import { HttpClientModule } from '@angular/common/http';
import { RoutePullupFooterComponent } from 'src/app/route-pullup-footer/route-pullup-footer.component';
import { IndoorFloorSelectorComponent } from 'src/app/indoor-floor-selector/indoor-floor-selector.component';

describe('DemoIndoorNavPage', () => {
  let component: DemoIndoorNavPage;
  let fixture: ComponentFixture<DemoIndoorNavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DemoIndoorNavPage,
        FloorPlanComponent,
        RoutePullupFooterComponent,
        IndoorFloorSelectorComponent,
      ],
      imports: [IonicModule.forRoot(), FormsModule, IonicPullupModule, HttpClientModule],
      providers: [{ provide: MapCoordinator, useValue: { load: jasmine.createSpy('load').and.returnValue(new Promise(() => true)) } }]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoIndoorNavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
