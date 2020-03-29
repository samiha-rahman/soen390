import { Component, OnInit } from '@angular/core';
import { MapItem } from 'src/app/helpers/map-item';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SourceDestination } from '../../interfaces/source-destination';
import { MapModeStore } from 'src/app/providers/state-stores/map-mode-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { ViewMode } from 'src/app/models/view-mode.enum.model';

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
  isIndoor: boolean;

  private _unsubscribe: UnsubscribeCallback;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _fb: FormBuilder,
    private _mapModeStore: MapModeStore
  ) {
    this.createDirectionForm();
    this._unsubscribe = this._mapModeStore.subscrbe(() => {
      this.maps = [this._mapModeStore.getMapModeState()];
      if (Object.keys(this._mapModeStore.getMapModeState().data).length > 1) {
        this.isIndoor = true;
      }
      else {
        this.isIndoor = false;
      }
    });
  }

  ngOnInit() {
    this._mapModeStore.setMode(ViewMode.GOOGLE);
    this.isIndoor = false;
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

  loadGoogleMaps() {
    this._mapModeStore.setMode(ViewMode.GOOGLE);
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

}
