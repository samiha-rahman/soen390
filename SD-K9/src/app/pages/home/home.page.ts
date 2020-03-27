import { Component, OnInit } from '@angular/core';
import { MapItem } from 'src/app/helpers/map-item';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SourceDestination } from '../../interfaces/source-destination';

import { IonPullUpFooterState } from 'ionic-pullup';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  maps: MapItem[];
  directionForm: FormGroup;
  transportMode: string;
  indoorMode: string;

  constructor(
    private modalController: ModalController,
    private _mapCoordinator: MapCoordinator,
    private _fb: FormBuilder
  ) {
    this.createDirectionForm();
  }

  ngOnInit() {
    this.maps = [this._mapCoordinator.getMap()];
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  //Verify form
  createDirectionForm() {
    this.directionForm = this._fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  calculateAndDisplayRoute(formValues: SourceDestination) {
    let tempMaps: Promise<MapItem[]> = this._mapCoordinator.getOverallRoute(formValues);
    tempMaps.then((maps) => {
      if (maps.length > 0) {
        this.maps = maps;
      }
    });
  }

  getIndoorMode(event): string {
    switch (event.detail.value) {
      case "LOYOLA": {
        this.indoorMode = "LOYOLA";
        this.maps = [this._mapCoordinator.getMap(this.indoorMode.toLowerCase())];
        break;
      }
      case "HALL":{
        this.indoorMode = "HALL";
        this.maps = [this._mapCoordinator.getMap(this.indoorMode.toLowerCase())];
        break;
      }
      default: {
        this.indoorMode = "DISABLED" ;
        this.maps = [this._mapCoordinator.getMap()];
      }
    }
    return this.indoorMode;
  }

  //Travel mode selected
  mode(event): string {
    if(event.detail.value == "DRIVING"){
        this.transportMode = "DRIVING"
    }else if(event.detail.value == "WALKING"){
        this.transportMode = "WALKING"
    }else if(event.detail.value == "BICYCLING"){
        this.transportMode = "BYCYCLING"
    }else if(event.detail.value == "TRANSIT"){
        this.transportMode = "TRANSIT"
    }
    return this.transportMode;
}
async openModal() {
    const modal = await this.modalController.create({
      component: BusPage
    });
    return await modal.present();
  }

  async openModal1() {
    const modal = await this.modalController.create({
      component: AppsettingsPage
    });
    return await modal.present();
  }

  //optional capture events
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

}
