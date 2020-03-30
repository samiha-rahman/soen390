import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PickerColumnOption } from '@ionic/core';

import { IndoorFloorSelectorComponent } from './indoor-floor-selector.component';

describe('IndoorFloorSelectorComponent', () => {
  let component: IndoorFloorSelectorComponent;
  let fixture: ComponentFixture<IndoorFloorSelectorComponent>;
  const floors: PickerColumnOption[] = [
    { text: '1', value: 1 },
    { text: '5', value: 5 },
    { text: '7', value: 7 },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndoorFloorSelectorComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorFloorSelectorComponent);
    component = fixture.componentInstance;
    component.currentFloor = 10;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should display floor number', () => {
    let displayedFloorNumber = fixture.nativeElement.querySelector("#number");
    expect(displayedFloorNumber.innerHTML).toEqual('10');
  });

  it('#showFloorPicker should create picker options', async () => {
    component.currentBuilding = 'test';
    console.log('sewtting buildig config')
    component.buildingConfig = {
      "test": {
        "floors": [1, 5, 7],
      }
    }
    await component.showFloorPicker();
    for (let i = 0; i < component.pickerOptions.length; i++) {
      expect(component.pickerOptions[i].value).toEqual(floors[i].value);
    }
  });
});
