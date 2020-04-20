import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState} from 'ionic-pullup';
import { ModalController } from '@ionic/angular';
import { AppSettings } from 'src/app/pages/app-settings/app-settings.page';
import { BusPage} from 'src/app/pages/bus/bus.page';
import { GoogleStore } from '../../providers/state-stores/google-store.service';
import { UnsubscribeCallback } from '../../interfaces/unsubscribe-callback';
import { DirectionFormStore } from '../../providers/state-stores/direction-form-store.service';
import { QueuedRoutePage } from 'src/app/pages/queued-route/queued-route.page';

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
  private _markerAddress:any;
  pullUpBarVisible: boolean;


constructor(
  public modalController: ModalController,
  private _googleStore: GoogleStore,
  private _directionFormStore: DirectionFormStore
  ) {
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

  async presentQueuedRouteModal() {
    const modal = await this.modalController.create({
      component: QueuedRoutePage
    });
    return await modal.present();
  }

  ngOnInit() {
    this.pullUpBarVisible = false;
    this.footerState = IonPullUpFooterState.Collapsed;
  }

    // optional capture events
    footerExpanded() {
      this.pullUpBarVisible = true;
        console.log('Footer expanded!');
    }

    // optional capture events
    footerCollapsed() {
      this.pullUpBarVisible = false;
        console.log('Footer collapsed!');
    }

    // toggle footer states
    toggleFooter() {
        this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    }

    setPOIasStartingPoint(_self : PullupComponent) {
      _self._directionFormStore.setSource(' '); //added this placeholder so that user don't have to click button twice because async
      _self._directionFormStore.setSource(_self._markerAddress);
    }

    setPOIasDestination(_self : PullupComponent) {
      _self._directionFormStore.setDestination(' '); //added this placeholder so that user don't have to click button twice because async
      _self._directionFormStore.setDestination(_self._markerAddress);
    }

    private _placeNearMeMarkers(request,map){

      //clear existing markers
      for(let i = 0; i < this._nearMeMarkers.length; i++){
        this._nearMeMarkers[i].setMap(null);
      }
      this._nearMeMarkers = [];

      let places = new google.maps.places.PlacesService(map);
      let _self = this;

      //place all nearby pins for nearby POIs
      places.nearbySearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {

            let infowindow = new google.maps.InfoWindow();

            // fetch btns from DOM
            let startBtn = document.getElementById('setPOIasStart');
            let destBtn = document.getElementById('setPOIasDest');
            startBtn.style.display = 'block';
            destBtn.style.display = 'block';

            // We need to make deep clones of the elements since we place them in the infowindow via Node (vs via string, which does not allow listeners)
            let startBtnClone = startBtn.cloneNode(true);
            let destBtnClone = destBtn.cloneNode(true);

            // add listeners to btns
            startBtnClone.addEventListener("click",function(){_self.setPOIasStartingPoint(_self)});
            destBtnClone.addEventListener("click",function(){_self.setPOIasDestination(_self)});

            // create the info window as a node with content and btns to navigate
            let infowWindowNode = document.createElement('div');
            infowWindowNode.innerHTML = "<div><h3>" + results[i].name + "</h3><br><p>Rating : " + results[i].rating + "</p></div>";
            infowWindowNode.append(startBtnClone);
            infowWindowNode.append(destBtnClone);

            infowindow.setContent(infowWindowNode);

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
              vicinity: results[i].vicinity,
              position: results[i].geometry.location
            });
            marker.addListener('click', function() {
              // keep track of current open address to allow navigation btns from inside the info window
              _self._markerAddress = marker.vicinity;
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


//testing

  hidePullupbar() {
    this.pullUpBarVisible = false;
    this.footerState = IonPullUpFooterState.Collapsed;
  }

}
