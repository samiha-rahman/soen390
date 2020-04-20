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

  it('#goInside should change the current building to hall when clicked', () => {
    component.goInside('hall');
    expect(component.getCurrentBuilding()).toEqual("hall");
  });

  it('#hideBuildingInfoCard should hide building info card', () => {
    component.buildingInfoCardIsShown = true;
    component.hideBuildingInfoCard();
    expect(component.buildingInfoCardIsShown).not.toBeTruthy();
  });

  it('#toggleBuildingInfoCardTabs should toggle between info cards tabs', () => {
    expect(component.showDepartments).toBeTruthy();
    component.toggleBuildingInfoCardTabs({detail:{value:"services"}});
    expect(component.showDepartments).not.toBeTruthy();
    component.toggleBuildingInfoCardTabs({detail:{value:"departments"}});
    expect(component.showDepartments).toBeTruthy();
  });


  it('#viewInsideDisabled should be true on init', () => {
    expect(component.viewInsideDisabled()).toBeTruthy();
  });


});
