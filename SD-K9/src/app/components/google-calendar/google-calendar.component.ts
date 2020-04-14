import { Component, OnInit } from '@angular/core';
import { GoogleCalendarService } from 'src/app/providers/firebase/google-calendar.service';
import { CalendarListStore } from 'src/app/providers/state-stores/calendar-list-store.service';
import { CalendarIdState } from 'src/app/interfaces/states/calendar-list-state';

@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.scss']
})
export class GoogleCalendarComponent implements OnInit {
  calendarItems = [];
  calendarList: CalendarIdState[] = [];

  constructor(
    public googleCalendar: GoogleCalendarService,
    private _calendarListStore: CalendarListStore
    ) { }

  ngOnInit() {
    this.calendarList = this._calendarListStore.getCalendarListState().calendarIds;
  }

  signOut() {
    this.googleCalendar.signOut();
  }

  sync() {
    this.googleCalendar.googleSignin();
  }

  async getCalendarList() {
    await this.googleCalendar.getCalendarList();
  }

  /**
   * Get all events from selected calendars, if any.
   */
  async getEvents() {
    this.calendarList.forEach(async(calendar) => {
      if (calendar.checked) {
        let currentItems = await this.googleCalendar.getEvents(calendar.id);
        if (currentItems.length > 0) {
          this.calendarItems = this.calendarItems.concat(currentItems);
        }
      }
    });
  }

  toggleChange(toggleValue) {
    this._calendarListStore.updateCheckedValues(this.calendarList);
  }
}
