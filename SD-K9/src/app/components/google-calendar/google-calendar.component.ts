import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoogleCalendarService } from 'src/app/providers/firebase/google-calendar.service';

declare var gapi: any;

@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.scss']
})
export class GoogleCalendarComponent implements OnInit {
  calendarItems = [];

  constructor(public googleCalendar: GoogleCalendarService) { }

  ngOnInit() {}

  signOut() {
    this.googleCalendar.singOut();
  }

  sync() {
    this.googleCalendar.googleSignin();
  }

  async getEvents() {
    this.calendarItems = await this.googleCalendar.getEvents();
  }

}
