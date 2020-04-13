import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import * as credentials from 'src/environments/credentials.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarListStore } from '../state-stores/calendar-list-store.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  user$: Observable<User>;

  private _authResponse: any;

  // Client ID and API key from the Developer Console
  private _CLIENT_ID = credentials.web.client_id;
  private _API_KEY = credentials.apiKey;

  // Array of API discovery doc URLs for APIs used by the quickstart
  private _DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Permission: access type to google calendar
  private _SCOPES = "https://www.googleapis.com/auth/calendar";


  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _http: HttpClient,
    private _calendarListStore: CalendarListStore,
    private _googleplus: GooglePlus,
    private _platform: Platform
    // private _angularFireStore: AngularFirestore // TODO: To remove in this service, but currently serves as a reminder that we have FireStore
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

  async signin() {
    if (this._platform.is('cordova')) {
      this._googleplusLogin();
    }
    else {
      const googleAuth = gapi.auth2.getAuthInstance();
      const googleUser = await googleAuth.signIn().catch((error) => {console.log(error)});
  
      this._authResponse = googleUser.getAuthResponse();
  
      const token = googleUser.getAuthResponse().id_token;
      const credential = firebase.auth.GoogleAuthProvider.credential(token);
      await this._angularFireAuth.signInWithCredential(credential);
    }
  }

  private async _googleplusLogin() {
    await this._googleplus.login({
      'webClientId': this._CLIENT_ID,
      'offline': true,
      'scopes': this._SCOPES
    })
    .then(result => {

      console.log('Result ', result);

      const credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
      this._angularFireAuth.signInWithCredential(credential)
      .then( success => {
        console.log("Firebase success: " + JSON.stringify(success));
      })
      .catch( error => console.error("Firebase failure: " + JSON.stringify(error)));
    })
    .catch(error => console.error("Error: ", error));
  }

  async signOut() {
    await this._angularFireAuth.signOut();
    this._calendarListStore.clear();
  }

  async getCalendarList() {
    // clear calendar list
    this._calendarListStore.clear();

    let calendarIds: string[] = [];

    // while google auth2 does not publicly provide a refresh token, request user to sign in.
    if (!this._authResponse) {
      await this.signin();
    }

    // while google calendar api does not provide a special keyword to get all calendarIds
    // request to get a list of calendars via HttpClient
    let reqHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'cache-control': 'private',
      'Authorization': `${this._authResponse.token_type} ${this._authResponse.access_token}`
    })
    await this._http.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {headers: reqHeaders})
    .subscribe(resource => {   
      let items = resource['items'];

      items.forEach(async(item) => {
        let calendarId: string = item['id'];

        this._calendarListStore.storeCalendarId({id: calendarId, checked: true});
        calendarIds.push(calendarId);
      });
    });

    return calendarIds;
  }

  async getEvents(calendarId: string) {
    const events = await gapi.client.calendar.events.list({
      calendarId: calendarId,
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return events.result.items;
  }
}
