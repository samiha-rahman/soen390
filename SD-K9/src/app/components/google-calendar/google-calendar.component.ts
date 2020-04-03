import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseAuthService } from 'src/app/providers/firebase/firebase-auth.service';

declare var gapi: any;

@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.scss']
})
export class GoogleCalendarComponent implements OnInit {
  calendarItems = [];

  constructor(public firebaseAuth: FirebaseAuthService) { }

  ngOnInit() {}

  signOut() {
    this.firebaseAuth.singOut();
  }

  sync() {
    this.firebaseAuth.googleSignin();
  }

  async getEvents() {
    this.calendarItems = await this.firebaseAuth.getEvents();
  }

}
