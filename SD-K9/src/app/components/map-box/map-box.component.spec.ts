import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestModule } from '../../test-helpers/test-module.module';

import { MapBoxComponent } from './map-box.component';
import { MapItem } from 'src/app/helpers/map-item';
import { MapDirective } from 'src/app/directives/map.directive';
import { MockComponent } from '../../test-helpers/mock-component.component';

describe('MapBoxComponent', () => {
  let component: MapBoxComponent;
  let fixture: ComponentFixture<MapBoxComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBoxComponent, MapDirective ],
      imports: [ IonicModule.forRoot(), TestModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapBoxComponent);
    component = fixture.componentInstance;
    let map = new MapItem(MockComponent, {id: 1});
    component.maps = [map];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
