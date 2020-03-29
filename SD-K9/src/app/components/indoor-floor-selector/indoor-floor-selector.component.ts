import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import * as buildingData from '../../../local-configs/buildings.json';
import { MapModeStore } from 'src/app/providers/state-stores/map-mode-store.service.js';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback.js';

@Component({
  selector: 'indoor-floor-selector',
  templateUrl: './indoor-floor-selector.component.html',
  styleUrls: ['./indoor-floor-selector.component.scss'],
})
export class IndoorFloorSelectorComponent implements OnInit, OnDestroy {

  private _buildingConfig: any;
  private _unsubscribe: UnsubscribeCallback;

  public currentFloor: any;
  public currentBuilding: any;

  constructor(
    private _pickerCtrl: PickerController,
    private _mapModeStore: MapModeStore
  ) {
    this._unsubscribe = this._mapModeStore.subscribe(() => {
      this.currentFloor = this._mapModeStore.getMapModeState();
      this.currentBuilding = this._mapModeStore.getMapModeState();
    });
  }

  ngOnInit() {
    this._buildingConfig = buildingData["default"];
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  private createPickerOptions(): PickerColumnOption[] {
    const floors = this._buildingConfig[this.currentBuilding].floors;
    const out = [];
    for (const floor of floors) {
      out.push({ text: floor, value: floor });
    }
    this._options = out;
    return out;
  }

  async showFloorPicker() {
    let opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (data) => {
            // TODO: implement logic to change floors
          }
        }
      ],
      columns: [{
        name: 'floor',
        options: this.createPickerOptions()
      }]
    };

    const picker = await this._pickerCtrl.create(opts);
    picker.present();
  }
}