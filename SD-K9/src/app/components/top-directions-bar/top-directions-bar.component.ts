import { Component, OnInit, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { Transport } from 'src/app/models/transport.enum.model';
import { DirectionForm } from 'src/app/interfaces/direction-form';
import { NavController } from '@ionic/angular';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MapModeStore } from 'src/app/providers/state-stores/map-mode-store.service';
import { VerticalTransport } from 'src/app/models/vertical-transport.enum.model';

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

  isIndoor: boolean;
  directionSent: boolean;
  directionFormSize: number;
  backButtonSize: number;

  get transportEnum() { return Transport; }
  get verticalTransportEnum() { return VerticalTransport; }

  private _unsubscribeDirectionFormStore: UnsubscribeCallback;
  private _unsubscribeMapModeStore: UnsubscribeCallback;

  constructor(
    private _navController: NavController,
    private _directionFormStore: DirectionFormStore,
    private _mapModeStore: MapModeStore
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
  }

  ngOnInit() {
    this.isIndoor = false;
    this.transport = Transport.TRANSIT;
    this.verticalTransport = VerticalTransport.ESCALATOR;
    this._resetGridSettings();
  }

  transportSegmentChanged(event) {
    this.transport = event.detail.value;
    this._directionFormStore.setTransport(this.transport);
    this.sendDirection();
  }

  verticalTransportSegmentChanged(event) {
    this.verticalTransport = event.detail.value;
    this._directionFormStore.setVerticalTransport(this.verticalTransport);
    this.sendDirection();
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
    this.directionSent = false;
    this.directionFormSize = 12;
    this.backButtonSize = 0;
  }

  private _setGridSettings(searchInputSize: number) {
    this.directionFormSize = searchInputSize;
    this.backButtonSize = 12 - searchInputSize;
  }

}
