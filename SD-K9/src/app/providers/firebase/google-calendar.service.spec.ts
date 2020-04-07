import { TestBed } from '@angular/core/testing';

import { GoogleCalendarService } from './google-calendar.service';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { HttpClientModule } from '@angular/common/http';

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        HttpClientModule
      ],
      providers: [
        AngularFireAuth
      ]
    }).compileComponents();
    
    window['gapi'] = {
      load() {return null;}
    }
    service = TestBed.get(GoogleCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
