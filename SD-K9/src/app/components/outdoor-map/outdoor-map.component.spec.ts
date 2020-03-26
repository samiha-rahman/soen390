import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutdoorMapComponent } from './outdoor-map.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OutdoorRouteBuilder } from 'src/app/providers/outdoor-route-builder.service';

var geolocate = require('mock-geolocation');

describe('OutdoorMapComponent', () => {
  let component: OutdoorMapComponent;
  let fixture: ComponentFixture<OutdoorMapComponent>;

  let point = [54.980206086231, 82.898068362003];

  class MockGeolocation extends Geolocation {
    getCurrentPosition() {
        return new Promise<any>(geolocate.use());
    }

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ OutdoorMapComponent ],
        imports: [IonicModule.forRoot()],
        providers: [
            {provide: Geolocation, useClass: MockGeolocation},
            OutdoorRouteBuilder
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(OutdoorMapComponent);
    component = fixture.componentInstance;
    geolocate.use();
    geolocate.send({lat: point[0], lng: point[1]});
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
