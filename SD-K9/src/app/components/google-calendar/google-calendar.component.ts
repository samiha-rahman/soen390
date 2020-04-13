import { Component, OnInit } from '@angular/core';
import { GoogleCalendarService } from 'src/app/providers/firebase/google-calendar.service';
import { CalendarListStore } from 'src/app/providers/state-stores/calendar-list-store.service';
import { CalendarIdState } from 'src/app/interfaces/states/calendar-list-state';
import { SQLiteQueuedRoutes } from 'src/app/providers/sqlite/queued-routes.sqlite.service';
import { QueuedRoute } from 'src/app/interfaces/sqlite/queued-route';

@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.scss']
})
export class GoogleCalendarComponent implements OnInit {
  calendarItems = [];
  calendarList: CalendarIdState[] = [];
  calendarEventsSuccess = [];
  calendarEventsFail = [];

  private _sqliteQueuedRoutesReady: boolean;

  constructor(
    public googleCalendar: GoogleCalendarService,
    private _calendarListStore: CalendarListStore,
    private _sqliteQueuedRoutes: SQLiteQueuedRoutes
    ) {
      this._sqliteQueuedRoutes.getDatabaseState().subscribe(ready => {
        this._sqliteQueuedRoutesReady = ready;
      });
     }

  ngOnInit() {
    this.calendarList = this._calendarListStore.getCalendarListState().calendarIds;
    this._sqliteQueuedRoutesReady = false;
  }

  signOut() {
    this.googleCalendar.signOut();
  }

  async sync() {
    this.googleCalendar.signin();
    // await this.googleCalendar.googleplusLogin()
    // .then(result => {
    //   console.log(result);
    // })
    // .catch(error => {console.log(error)});
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
          this.calendarItems = this.calendarItems.concat(currentItems)
          console.log(this.calendarItems);

          currentItems.forEach(element => {
            if (element.location) {
              this._sqliteQueuedRoutes.addQueuedRoute({
                id: element.id,
                summary: element.summary,
                location: element.location,
                startTime: element.start.dateTime,
                endTime: element.end.dateTime
              });
              this.calendarEventsSuccess.push(element);
            }
            else {
              this.calendarEventsFail.push(element);
            }
          });
        }
      }
    });
  }

  toggleChange(toggleValue) {
    this._calendarListStore.updateCheckedValues(this.calendarList);
  }
}
