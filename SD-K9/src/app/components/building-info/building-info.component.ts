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
  currentBuildingDepartmentsInfo: string;
  currentBuildingServicesInfo: string;
  buildingInfoCardIsShown: boolean;
  showDepartments: boolean = true;
  showServices: boolean = false;

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
      this.currentBuildingDepartmentsInfo = this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['departments'];
      this.currentBuildingServicesInfo = this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['services'];
      if (this.currentBuildingDepartmentsInfo == undefined) {
        this.currentBuildingDepartmentsInfo = "no information to show";
      }
      if (this.currentBuildingServicesInfo == undefined) {
        this.currentBuildingServicesInfo = "no information to show";
      }
      this.buildingInfoCardIsShown = true;
    }
    else {
      this.buildingInfoCardIsShown = false;
    }
  }
  setStartLocation(){
    let fullName=this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['fullName'];
    this._directionFormStore.setSource(fullName);
  }

  setDestinationLocation(){
    let fullName=this._campusConfig[this.currentCampus]["buildings"][this.currentBuilding]['fullName'];
    this._directionFormStore.setDestination(fullName);
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

  toggleBuildingInfoCardTabs(e){
    let toShow = e.detail.value;
    if(toShow == "departments"){
      this.showDepartments = true;
      this.showServices = false;
    }else{
      this.showDepartments = false;
      this.showServices = true;
    }
  }

  hideBuildingInfoCard(event) {
    this.buildingInfoCardIsShown = false;

    //Makes clickable buildings more reliable
    this._buildingInfoStore.clearBuildingInfo();
  }

  ngOnDestroy() {
    this._unsubscribe();
  }
}
