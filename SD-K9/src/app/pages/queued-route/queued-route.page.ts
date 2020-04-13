import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueuedRouteStore } from 'src/app/providers/state-stores/queued-route-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { QueuedRouteState } from 'src/app/interfaces/states/queued-routes-state';

@Component({
  selector: 'app-queued-route',
  templateUrl: './queued-route.page.html',
  styleUrls: ['./queued-route.page.scss'],
})
export class QueuedRoutePage implements OnInit, OnDestroy {
  id: any;
  summary: string;
  location: string;
  startTime: Date;
  endTime: Date;  
  private _unsubscribe: UnsubscribeCallback;
  private _numRoutes: number;
  public queuedRouteState: QueuedRouteState;

  constructor(
    private modalController: ModalController,
    private _queuedRouteStore: QueuedRouteStore,
    private _directionFormStore: DirectionFormStore,
    
  ) { 
    this._unsubscribe = this._queuedRouteStore.subscribe(() => {
      this._numRoutes = this._queuedRouteStore.getQueuedRouteState().routes.length - 1;
      this.queuedRouteState = this._queuedRouteStore.getQueuedRouteState();
      console.log("hello");
    });
  }

  ngOnInit() {

  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  setNextClass(){
    let nextClass=document.getElementById("classroom").innerHTML;
    this._directionFormStore.setDestination(nextClass);
  }

  ngOnDestroy() {
    this._unsubscribe();
  }
}
