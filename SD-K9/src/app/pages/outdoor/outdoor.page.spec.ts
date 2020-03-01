import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OutdoorPage } from './outdoor.page';

declare var google;


describe('OutdoorPage', () => {
  let component: OutdoorPage;
  let fixture: ComponentFixture<OutdoorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorPage ],
      imports: [IonicModule.forRoot()],
      providers: [Geolocation]
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
