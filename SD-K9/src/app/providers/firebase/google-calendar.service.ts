import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import * as credentials from 'src/environments/credentials.json';
declare var gapi: any;


@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  user$: Observable<User>;

  // Client ID and API key from the Developer Console
  private _CLIENT_ID = credentials.web.client_id;
  private _API_KEY = credentials.apiKey;

  // Array of API discovery doc URLs for APIs used by the quickstart
  private _DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Permission: access type to google calendar
  private _SCOPES = "https://www.googleapis.com/auth/calendar";


  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _angularFireStore: AngularFirestore // TODO: To remove in this service, but currently serves as a reminder that we have FireStore
  ) {
    this._initClient();
    this.user$ = this._angularFireAuth.authState;
  }

  private _initClient() {
    gapi.load('client:auth2', () => {
      console.log('loaded client');

      gapi.client.init({
        apiKey: this._API_KEY,
        clientId: this._CLIENT_ID,
        discoveryDocs: this._DISCOVERY_DOCS,
        scope: this._SCOPES
      });

      // Important to let gapi.client know user is authorized
      gapi.auth2.init({
        clientId: this._CLIENT_ID,
        scope: this._SCOPES
      })

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar client'));
    });
  }

  async googleSignin() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn().catch((error) => {console.log(error)});

    const token = googleUser.getAuthResponse().id_token;
    const credential = firebase.auth.GoogleAuthProvider.credential(token);
    await this._angularFireAuth.signInWithCredential(credential);
  }

  async singOut() {
    await this._angularFireAuth.signOut();
  }

  async getEvents() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      // maxResults: 10,
      orderBy: 'startTime'
    });
    
    return events.result.items;
  }
}
