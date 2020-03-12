import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonicPullupModule, IonPullUpFooterState } from 'ionic-pullup';

import { RoutePullupFooterComponent } from './route-pullup-footer.component';

describe('RoutePullupFooterComponent', () => {
  let component: RoutePullupFooterComponent;
  let fixture: ComponentFixture<RoutePullupFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoutePullupFooterComponent],
      imports: [IonicModule.forRoot(), IonicPullupModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutePullupFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
