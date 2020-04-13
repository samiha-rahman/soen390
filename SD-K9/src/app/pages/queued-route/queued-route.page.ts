import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueuedRouteStore } from 'src/app/providers/state-stores/queued-route-store.service';
import { UnsubscribeCallback } from 'src/app/interfaces/unsubscribe-callback';
import { DirectionFormStore } from 'src/app/providers/state-stores/direction-form-store.service';
import { QueuedRouteState } from 'src/app/interfaces/states/queued-routes-state';
import { QueuedRoute } from 'src/app/interfaces/queued-route';
import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'app-queued-route',
  templateUrl: './queued-route.page.html',
  styleUrls: ['./queued-route.page.scss'],
})
export class QueuedRoutePage implements OnInit {
  id: any;
  summary: string;
  location: string;
  startTime: Date;
  endTime: Date;  
  private _unsubscribe: UnsubscribeCallback;
  private _numRoutes: number;
  public queuedRouteState: QueuedRoute[];
  footerState: IonPullUpFooterState;

  constructor(
    private modalController: ModalController,
    private _queuedRouteStore: QueuedRouteStore,
    private _directionFormStore: DirectionFormStore,

    
  ) { 
  }

  ngOnInit() {
    this.queuedRouteState = this._queuedRouteStore.getQueuedRouteState().routes;
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  nextClass(item){
    this._directionFormStore.setDestination(item.location);
    this.closeModal();
    this.toggleFooter();
  }

  toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
}
}
