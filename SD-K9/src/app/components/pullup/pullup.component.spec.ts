import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';
import { PullupComponent } from './pullup.component';
import { IonPullUpFooterState} from 'ionic-pullup';

describe('PullupComponent', () => {
  let component: PullupComponent;
  let fixture: ComponentFixture<PullupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PullupComponent,
        IonicPullupModule,
        IonPullUpFooterState
       ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PullupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
