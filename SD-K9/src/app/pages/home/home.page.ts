import { Component, OnInit } from '@angular/core';
import { MapItem } from 'src/app/helpers/map-item';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { DirectionForm } from '../../interfaces/direction-form';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { FloorPlanStore } from 'src/app/providers/state-stores/floor-plan-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { ViewMode } from 'src/app/models/view-mode.enum.model';
import { MapModeStore } from 'src/app/providers/state-stores/map-mode-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  maps: MapItem[];
  transportMode: string;

  private _unsubscribeDirectionFormStore: UnsubscribeCallback;
  private _unsubscribeMapModeStore: UnsubscribeCallback;
  private _directionForm: DirectionForm;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _directionFormStore: DirectionFormStore,
    private _routeStore: RouteStore,
    private _floorPlanStore: FloorPlanStore,
    private _mapModeStore: MapModeStore
  ) {
    this._unsubscribeDirectionFormStore = this._directionFormStore.subscribe(() => {
      this._directionForm = this._directionFormStore.getDirectionFormState();
    });
    this._unsubscribeMapModeStore = this._mapModeStore.subscribe(() => {
      this.maps = [this._mapModeStore.getMapModeState()];
    });
  }

  ngOnInit() {
    this._mapModeStore.setMode(ViewMode.GOOGLE);
  }

  getForm(formComplete: boolean) {
    if (formComplete) {
      this._calculateAndDisplayRoute(this._directionForm);
    }
    else {
      this._mapModeStore.setMode(ViewMode.GOOGLE);
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

  loadGoogleMaps() {
    this._mapModeStore.setMode(ViewMode.GOOGLE);
  }

}
