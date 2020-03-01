import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { IonicPullupModule } from 'ionic-pullup';
import { IonPullUpFooterState } from 'ionic-pullup';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;


describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), FormsModule, IonicPullupModule],
      providers: [{provide: MapCoordinator, useValue: {load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))}},Geolocation]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
