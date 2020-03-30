import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import * as buildingData from '../../../local-configs/buildings.json';
import { MapModeStore } from '../../providers/state-stores/map-mode-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback.js';
import { ViewMode } from '../../models/view-mode.enum.model';

@Component({
  selector: 'indoor-floor-selector',
  templateUrl: './indoor-floor-selector.component.html',
  styleUrls: ['./indoor-floor-selector.component.scss'],
})
export class IndoorFloorSelectorComponent implements OnInit, OnDestroy {

  private _unsubscribe: UnsubscribeCallback;

  public buildingConfig: any;
  public currentFloor: any;
  public currentBuilding: any;
  public currentView: string;
  public pickerOptions: PickerColumnOption[];

  constructor(
    private _pickerCtrl: PickerController,
    private _mapModeStore: MapModeStore
  ) {
    this._unsubscribe = this._mapModeStore.subscribe(() => {
      this.currentView = this._mapModeStore.getMapModeState().component.name;
      this.currentFloor = this._mapModeStore.getMapModeState().data.floor;
      this.currentBuilding = this._mapModeStore.getMapModeState().data.building;
    });

  }

  ngOnInit() {
    this.buildingConfig = buildingData['default'];
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  private _createPickerOptions(): PickerColumnOption[] {
    const floors = this.buildingConfig[this.currentBuilding].floors;
    const out = [];
    for (const floor of floors) {
      out.push({ text: floor, value: floor });
    }
    this.pickerOptions = out;
    return out;
  }

  async showFloorPicker() {
    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (data) => {
            this._mapModeStore.setMode(ViewMode.CUSTOM_INDOOR,
              { id: 1, floor: data.floor.value, building: this.currentBuilding });
          }
        }
      ],
      columns: [{
        name: 'floor',
        options: this._createPickerOptions()
      }]
    };

    const picker = await this._pickerCtrl.create(opts);
    picker.present();
  }
}