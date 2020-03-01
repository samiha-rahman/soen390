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

});
