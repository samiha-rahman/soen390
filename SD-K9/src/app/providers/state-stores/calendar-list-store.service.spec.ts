import { TestBed } from '@angular/core/testing';

import { CalendarListStore } from './calendar-list-store.service';
import { CalendarListState } from 'src/app/interfaces/states/calendar-list-state';

describe('CalendarListStore', () => {
  let service: CalendarListStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CalendarListStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('#getCalendarListState should return a type `CalendarListState`', () => {
    expect(instanceOfCalendarListState(service.getCalendarListState())).toBeTruthy();
  });

  it('#storeCalendarId should store `CalendarIdState {id: `test@gmail.com`, checked: true}` in `CalendarListState`', () => {
    let calendarIdState = {id: `test@gmail.com`, checked: true};
    service.storeCalendarId(calendarIdState);
    
    let storedCalendarIdState = service.getCalendarListState().calendarIds;
    expect(storedCalendarIdState.includes(calendarIdState)).toBeTruthy();
  });

  it('#clear should bring `CalendarListState` to an empty state', () => {
    service.clear();

    expect(service.getCalendarListState().calendarIds.length).toEqual(0);
  })

  it('#updateCheckedValues should override the current `CalendarListState` with a new `CalendarListState`', () => {
    let calendarIdState = {id: `test@gmail.com`, checked: true};
    service.storeCalendarId(calendarIdState);

    let newCalendarIdState = {id: `test@gmail.com`, checked: false};
    service.updateCheckedValues([newCalendarIdState]);

    expect(service.getCalendarListState().calendarIds.includes(calendarIdState)).toBeFalsy();
    expect(service.getCalendarListState().calendarIds.includes(newCalendarIdState)).toBeTruthy();
  });

  function instanceOfCalendarListState(object: any): object is CalendarListState {
    return 'calendarIds' in object;
  }
});
