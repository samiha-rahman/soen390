import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapCoordinator } from '../../providers/map-coordinator.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MapItem } from '../../helpers/map-item';
import { HttpClientModule } from '@angular/common/http';
import { MockComponent } from '../../test-helpers/mock-component.component';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let formBuilder: FormBuilder = new FormBuilder();

    let map = new MapItem(MockComponent, {data: ''});
    let mockMapCoordinator = jasmine.createSpyObj(['getMap']);
    mockMapCoordinator.getMap.and.returnValue([map]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ IonicModule.forRoot(), ReactiveFormsModule, HttpClientModule ],
      providers: [
        // MapCoordinator,
        {provide: FormGroup, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},
        {provide: FormBuilder, useValue: formBuilder },
        {provide: MapCoordinator, useValue: mockMapCoordinator}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    component.directionForm = formBuilder.group({source: '', destination: ''});
    fixture.detectChanges();
  }));

  afterEach(() => {
      formBuilder = null;
      map = null;
  })

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});