import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OutdoorPage } from './outdoor.page';
import { FormsModule } from '@angular/forms';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { IonicPullupModule, IonPullUpFooterState } from 'ionic-pullup';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';
import { RouterTestingModule } from '@angular/router/testing';


declare var google;


describe('OutdoorPage', () => {
  let component: OutdoorPage;
  let fixture: ComponentFixture<OutdoorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorPage ],
      imports: [IonicModule.forRoot(), FormsModule, IonicPullupModule,RouterTestingModule],
      providers: [{ provide: MapCoordinator, useValue: { load: jasmine.createSpy('load').and.returnValue(new Promise(() => true)) } },Geolocation]
    }).compileComponents();

    fixture = TestBed.createComponent(OutdoorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the map', () =>{
    expect(component.mapInitialised).toBeTruthy();
  });

});
