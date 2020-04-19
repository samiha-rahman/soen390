import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoogleCalendarComponent } from './google-calendar.component';
import { GoogleCalendarService } from 'src/app/providers/firebase/google-calendar.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('GoogleCalendarComponent', () => {
  let component: GoogleCalendarComponent;
  let fixture: ComponentFixture<GoogleCalendarComponent>;
  let googleCalendarMock = jasmine.createSpyObj('googleCalendar', ['signOut', 'googleSignin', 'getEvents']);

  class GoogleCalendarServiceMock {
    signOut() {}
    googleSignin() {}
    async getEvents() { return []}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleCalendarComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: GoogleCalendarService, useValue: googleCalendarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#signOut should call `signOut` method from `GoogleCalendarService`', () => {
    component.signOut();

    expect(googleCalendarMock.signOut).toHaveBeenCalled();
  });

  it('#sync should call `googleSignin` method from `GoogleCalendarService`', () => {
    component.sync();

    expect(googleCalendarMock.googleSignin).toHaveBeenCalled();
  });

  it('#getEvents should call `getEvents` method from `GoogleCalendarService`', async() => {
    component.calendarList = [{id: 'test@gmail.com', checked: true}];
    component.getEvents();

    expect(googleCalendarMock.getEvents).toHaveBeenCalled();
  })
});
