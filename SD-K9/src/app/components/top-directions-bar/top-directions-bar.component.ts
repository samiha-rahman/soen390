import { Component, OnInit, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { Transport } from 'src/app/models/transport.enum.model';
import { DirectionForm } from 'src/app/interfaces/direction-form';
import { NavController } from '@ionic/angular';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MapModeStore } from 'src/app/providers/state-stores/map-mode-store.service';
import { VerticalTransport } from 'src/app/models/vertical-transport.enum.model';
import { RouteStore } from 'src/app/providers/state-stores/route-store.service';
import { RouteType } from 'src/app/models/route-type.enum.model';

@Component({
  selector: 'top-directions-bar',
  templateUrl: './top-directions-bar.component.html',
  styleUrls: ['./top-directions-bar.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => TopDirectionsBarComponent) }
  ]
})
export class TopDirectionsBarComponent implements OnInit {

  @Output() formCompleteEvent: EventEmitter<boolean> = new EventEmitter();

  start: string = '';
  end: string = '';
  transport: Transport;
  verticalTransport: VerticalTransport;
  directionForm: DirectionForm;
  map_type: any;

  isIndoor: boolean;
  directionSent: boolean;
  directionFormSize: number;
  backButtonSize: number;

  hasIndoors: boolean;
  hasOutdoors: boolean;
  routeStarted = false;

  verticalTransportationButton = [
    {
      label: VerticalTransport.STAIRS,
      color: "light",
      checked: false
    },
    {
      label: VerticalTransport.ESCALATORS,
      color: "primary",
      checked: true
    },
    {
      label: VerticalTransport.ELEVATORS,
      color: "light",
      checked: false
    }
  ]

  get transportEnum() { return Transport; }
  get verticalTransportEnum() { return VerticalTransport; }

  private _unsubscribeDirectionFormStore: UnsubscribeCallback;
  private _unsubscribeMapModeStore: UnsubscribeCallback;
  private _unsubscribeRouteStore: UnsubscribeCallback;

  constructor(
    private _navController: NavController,
    private _directionFormStore: DirectionFormStore,
    private _mapModeStore: MapModeStore,
    private _routeStore: RouteStore
  ) {
    this._unsubscribeDirectionFormStore = this._directionFormStore.subscribe(() => {
      this.start = this._directionFormStore.getDirectionFormState().sourceDestination.source;
      this.end = this._directionFormStore.getDirectionFormState().sourceDestination.destination;
      this.transport = this._directionFormStore.getDirectionFormState().transport;
      this.verticalTransport = this._directionFormStore.getDirectionFormState().verticalTransport;
    });
    this._unsubscribeMapModeStore = this._mapModeStore.subscribe(() => {
      if (Object.keys(this._mapModeStore.getMapModeState().data).length > 1) {
        this.isIndoor = true;
        this._setGridSettings(10);
      }
      else {
        this.isIndoor = false;
        this._resetGridSettings();
      }
    });
    this._unsubscribeRouteStore = this._routeStore.subscribe(() => {
      const routes = this._routeStore.getRouteState().routes
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].type == RouteType.INDOOR) {
          this.hasIndoors = true;
        }
        if (routes[i].type == RouteType.OUTDOOR) {
          this.hasOutdoors = true;
        }
      }
    });
  }

  ngOnInit() {
    this.isIndoor = false;
    this.transport = Transport.TRANSIT;
    this.verticalTransport = VerticalTransport.ESCALATORS;
    this._resetGridSettings();
  }

  transportSegmentChanged(event) {
    this.transport = event.detail.value;
    this._directionFormStore.setTransport(this.transport);
    this.sendDirection();
  }

  verticalTransportSegmentChanged(button) {
    for (let index in this.verticalTransportationButton) {
      let item = this.verticalTransportationButton[index]

      if (item.checked && item.label !== button) {
        // clear button
        this._toggleVerticalTransportValue(item)
      } else if (!item.checked && item.label === button) {
        this._toggleVerticalTransportValue(item)
        this.verticalTransport = VerticalTransport[item.label]
        console.log(this.verticalTransport)
        this._directionFormStore.setVerticalTransport(this.verticalTransport);
        this.sendDirection();
      }
    }
    console.log(this.verticalTransportationButton)
  }

  sendDirection() {
    if (this.start && this.end && this.transport) {
      this.directionSent = true;
      this._setGridSettings(10);
      this.formCompleteEvent.emit(true);
    }
  }

  goToSearchPage(query) {
    this._navController.navigateForward("search", { queryParams: { query: query } });
  }

  clearDirection() {
    this._resetGridSettings();
    this._directionFormStore.clear();
    this.formCompleteEvent.emit(false);
  }

  private _resetGridSettings() {
    this.hasIndoors = false;
    this.hasOutdoors = false;
    this.directionSent = false;
    this.directionFormSize = 12;
    this.backButtonSize = 0;
  }

  private _setGridSettings(searchInputSize: number) {
    this.directionFormSize = searchInputSize;
    this.backButtonSize = 12 - searchInputSize;
  }

  private _toggleVerticalTransportValue(item) {
    item.color = item.color == "primary" ? "light" : "primary"
    item.checked = !item.checked
  }

}
