import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
import { IonicPullupModule } from 'ionic-pullup';
import { IonPullUpFooterState } from 'ionic-pullup';

let Pullup = null;

describe('AppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should do nothing', () => {
    const service: AppService = TestBed.get(AppService);
    expect(true).toBeTruthy();
  });
});

describe('IonPullupModule', ()=>{
  beforeEach(() => {
    Pullup = new IonicPullupModule();  
  });

  it("Menu should be collapsed", () => {
    Pullup = IonPullUpFooterState.Collapsed;
    expect(Pullup).toEqual(IonPullUpFooterState.Collapsed)
  });
});
