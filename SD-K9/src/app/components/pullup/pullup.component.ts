import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState} from 'ionic-pullup';
import { ModalController } from '@ionic/angular';
import { AppSettings } from 'src/app/pages/app-settings/app-settings.page';
import { BusPage} from 'src/app/pages/bus/bus.page';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';

declare var google;

@Component({
  selector: 'app-pullup',
  templateUrl: './pullup.component.html',
  styleUrls: ['./pullup.component.scss'],
})
export class PullupComponent implements OnInit {
  footerState: IonPullUpFooterState;
  private _unsubscribe: UnsubscribeCallback;
  private _googleAutocomplete: any;
  private _nearMeMarkers:any[] = [];



constructor(public modalController: ModalController, private _googleStore: GoogleStore) {
  this._unsubscribe = this._googleStore.subscribe(() => {
    google = this._googleStore.getGoogleMapState().google;
  });
}

  async presentAppSettingsModal() {
    const modal = await this.modalController.create({
      component: AppSettings
    });
    return await modal.present();
  }

  async presentBusModal() {
    const modal = await this.modalController.create({
      component: BusPage
    });
    return await modal.present();
  }

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

    // optional capture events
    footerExpanded() {
        console.log('Footer expanded!');
    }

    // optional capture events
    footerCollapsed() {
        console.log('Footer collapsed!');
    }

    // toggle footer states
    toggleFooter() {
        this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    }

    private _placeNearMeMarkers(request,map){
      //clear existing markers
      for(let i = 0; i < this._nearMeMarkers.length; i++){
        this._nearMeMarkers[i].setMap(null);
      }
      this._nearMeMarkers = [];

      let places = new google.maps.places.PlacesService(map);
      places.nearbySearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            let infowindow = new google.maps.InfoWindow({
              content: "<h3>" + results[i].name + "</h3><br><p>Rating : " + results[i].rating + " </p>"
            });
            let image = {
              url: results[i].icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
            let marker = new google.maps.Marker({
              map: map,
              icon: image,
              title: results[i].name,
              position: results[i].geometry.location
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
            this._nearMeMarkers.push(marker);
          }
        }
      });
    }

    showNearMe(type : string){
      let map = this._googleStore.getGoogleMapState().map;
      let request = {
        location: map.getCenter(),
        radius: '500',
        type: [type]
      };

      this._placeNearMeMarkers(request,map);
      this.toggleFooter();
    }
}
