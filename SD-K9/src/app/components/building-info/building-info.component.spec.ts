import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuildingInfoComponent } from './building-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('BuildingInfoComponent', () => {
  let component: BuildingInfoComponent;
  let fixture: ComponentFixture<BuildingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingInfoComponent ],
      imports: [IonicModule.forRoot(),BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingInfoComponent);
    component = fixture.componentInstance;
    component.buildingInfoCardIsShown = false;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go inside hall building when clicked', () => {
    component.goInside('hall');
    expect(component.getCurrentBuilding()).toEqual("hall");
  });

  it('should go inside cc building when clicked', () => {
    component.goInside('cc');
    expect(component.getCurrentBuilding()).toEqual("loyola");
  });

  it('should hide building info card', () => {
    component.buildingInfoCardIsShown = true;
    component.hideBuildingInfoCard({default:"empty event"});
    expect(component.buildingInfoCardIsShown).not.toBeTruthy();
  });

});
