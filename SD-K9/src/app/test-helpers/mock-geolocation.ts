import { Geolocation } from '@ionic-native/geolocation/ngx';


export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  speed: number;
}

export interface Geoposition {
  coords: Coordinates;
  timestamp: number;
}

export class GeolocationMock extends Geolocation {
  getCurrentPosition(options?: any): Promise<Geoposition> {
    //hardcoded location for testing purposes
    let theResult = {
      coords: {
        latitude: 50,
        longitude: -50,
        accuracy: 10,
        altitude: 10,
        altitudeAccuracy: 10,
        heading: 10,
        speed: 0
      }, timestamp: 500
    };
    return new Promise((resolve, reject) => {
      resolve(theResult);
    });
  };

  // watchPosition(options?: GeolocationOptions): Observable<Geoposition> {
  //     let theData: Geoposition;
  //
  //     return Observable.create( (observer: Observer<any>) => {
  //         observer.next(theData);
  //         observer.complete();
  //     });
  //
  //
  // };
}
