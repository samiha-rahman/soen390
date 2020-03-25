import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OutdoorPage } from './outdoor.page';
import { FormsModule } from '@angular/forms';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { IonicPullupModule, IonPullUpFooterState } from 'ionic-pullup';
import { FloorPlanComponent } from '../floor-plan/floor-plan.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';


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

  it('Should have something for search bar', async(() => {
    fixture.whenStable().then(() => {
      let input = fixture.debugElement.query(By.css('ion-searchbar'));
      let element = input.nativeElement;
      element.value = 'something';
      expect(element.value).toContain('something');
    });
  }));

});
