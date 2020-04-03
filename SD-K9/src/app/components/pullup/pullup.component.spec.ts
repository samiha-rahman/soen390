import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PullupComponent } from './pullup.component';

describe('PullupComponent', () => {
  let component: PullupComponent;
  let fixture: ComponentFixture<PullupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PullupComponent
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
