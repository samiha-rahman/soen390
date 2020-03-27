import { Component, OnInit, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { Transport } from 'src/app/models/transport.enum.model';
import { DirectionForm } from 'src/app/interfaces/direction-form';
import { NavController } from '@ionic/angular';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
  directionForm: DirectionForm;

  directionSent: boolean;
  directionFormSize: number;

  get transportEnum() { return Transport; }

  private _unsubscribe: UnsubscribeCallback;

  constructor(
    private _navController: NavController,
    private _directionFormStore: DirectionFormStore
  ) {
    this._unsubscribe = this._directionFormStore.subscribe(() => {
      this.start = this._directionFormStore.getDirectionFormState().sourceDestination.source;
      this.end = this._directionFormStore.getDirectionFormState().sourceDestination.destination;
      this.transport = this._directionFormStore.getDirectionFormState().transport;
    });
  }

  ngOnInit() {
    this.transport = Transport.TRANSIT;
    this._resetGridSettings();
  }

  segmentChanged(event) {
    this.transport = event.detail.value;
    this._directionFormStore.setTransport(this.transport);
    this.sendDirection();
  }

  sendDirection() {
    if (this.start && this.end && this.transport) {
      this.directionSent = true;
      this.directionFormSize = 10;
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
  }

}
