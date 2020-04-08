import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//import * as schedule from '../../../local-configs/shuttlebus_schedule.json';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {
  } 
  async closeModal() {
      await this.modalController.dismiss();
    }
}
