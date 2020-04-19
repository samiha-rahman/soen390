import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PullupComponent } from './pullup.component';
import { IonicPullupModule } from 'ionic-pullup';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PullupComponent', () => {
  let component: PullupComponent;
  let fixture: ComponentFixture<PullupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PullupComponent
       ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PullupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should collapse when hidePullUpBar is called', () =>{
    component.pullUpBarVisible = true;
    component.hidePullupbar();
    expect(component.pullUpBarVisible).not.toBeTruthy();
  }
  );


});
