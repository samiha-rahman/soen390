import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { BuildingInfoStore } from 'src/app/providers/state-stores/building-info-store.service';
import { MapModeStore } from '../../providers/state-stores/map-mode-store.service';
import { ViewMode } from 'src/app/models/view-mode.enum.model';

import * as campusData from '../../../local-configs/campus.json';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';

@Component({
  selector: 'app-building-info',
  templateUrl: './building-info.component.html',
  styleUrls: ['./building-info.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('cardAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: "translate(0px,100px)",
        height: "0px"
      })),
      state('shown', style({
        opacity: 1,
        transform: "translate(0px,0px)",
        height: "auto"
      })),
      transition('hidden => shown', [
        animate('0.2s')
      ]),
      transition('shown => hidden', [
        animate('0.2s')
      ]),
    ])
  ]
})
export class BuildingInfoComponent implements OnInit, OnDestroy {
  currentBuilding: string;
  currentCampus: string;
  buildingSlug: string = '';
  currentBuildingInfo: string;
  buildingInfoCardIsShown: boolean;

  private _unsubscribe: UnsubscribeCallback;
  private _campusConfig: any;

  constructor(
    private _buildingInfoStore: BuildingInfoStore,
    private _mapModeStore: MapModeStore,
    private _directionFormStore: DirectionFormStore

  ) {
    this._unsubscribe = this._buildingInfoStore.subscribe(() => {
      this.currentBuilding = this._buildingInfoStore.getBuildingInfo().building;
      this.currentCampus = this._buildingInfoStore.getBuildingInfo().campus;
      this.buildingSlug = this._buildingInfoStore.getBuildingInfo().slug;
      this._displayCard();
    });
  }

  ngOnInit() {
    this.buildingInfoCardIsShown = false;
    this._campusConfig = campusData["default"];
  }

  private _displayCard() {
    if (this.currentCampus !== '' && this.currentBuilding !== '') {
      this.currentBuildingInfo = this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['info'];
      this.buildingInfoCardIsShown = true;
    }
    else {
      this.buildingInfoCardIsShown = false;
    }
  }
  setStartLocation(){
    let fullname=this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['fullName'];
    this._directionFormStore.setSource(fullname);
  }

  setDestionationLocation(){
    let fullname=this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['fullName'];
    this._directionFormStore.setDestination(fullname);
  }

  goInside(buildingSlug: string) {
    console.log(buildingSlug)
    this._mapModeStore.setMode(ViewMode[buildingSlug.toUpperCase()]);
  }

  //for testing
  getCurrentBuilding(): string {
    return this._mapModeStore.getMapModeState().data.building;
  }

  viewInsideDisabled(): boolean {
    try {
      const slug = this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]["buildingSlug"];
      if (slug !== undefined) {
        this.buildingSlug = slug;
        return false;
      }
    } catch {
      return true;
    }
    return true;
  }

  hideBuildingInfoCard(event) {
    this.buildingInfoCardIsShown = false;

    //Makes clickable buildings more reliable
    //this._buildingInfoStore.clearBuildingInfo();
  }

  ngOnDestroy() {
    this._unsubscribe();
  }
}
