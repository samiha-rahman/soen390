import { Component, OnInit } from '@angular/core';
import { MapItem } from 'src/app/helpers/map-item';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { SourceDestination } from '../../interfaces/source-destination';
import { DirectionForm } from '../../interfaces/direction-form';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { FloorPlanStore } from 'src/app/providers/state-stores/floor-plan-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  maps: MapItem[];
  transportMode: string;
  indoorMode: string;

  private _unsubscribe: UnsubscribeCallback;
  private _directionForm: DirectionForm;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _directionFormStore: DirectionFormStore,
    private _routeStore: RouteStore,
    private _floorPlanStore: FloorPlanStore
  ) {
    this._unsubscribe = this._directionFormStore.subscribe(() => {
      this._directionForm = this._directionFormStore.getDirectionFormState();
    });
  }

  ngOnInit() {
    this.maps = [this._mapCoordinator.getMap()];
  }

  getForm(formComplete: boolean) {
    if (formComplete) {
      this._calculateAndDisplayRoute(this._directionForm);
    }
    else {
      this.maps = [this._mapCoordinator.getMap()];
      this._routeStore.clearRoutes();
      this._floorPlanStore.clearFloorPlans();
    }
  }

  private _calculateAndDisplayRoute(directionForm: DirectionForm) {
    let tempMaps: Promise<MapItem[]> = this._mapCoordinator.getOverallRoute(directionForm);
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
      case "HALL": {
        this.indoorMode = "HALL";
        this.maps = [this._mapCoordinator.getMap(this.indoorMode.toLowerCase())];
        break;
      }
      default: {
        this.indoorMode = "DISABLED";
        this.maps = [this._mapCoordinator.getMap()];
      }
    }
    return this.indoorMode;
  }

}
