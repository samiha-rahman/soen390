import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {
  scheduleDataSGW: any;
  scheduleDataLoy: any;

  constructor(private modalController: ModalController) {
    this.read_json_sgw();
    this.read_json_loyola();
  }

  ngOnInit() {} 

  read_json_sgw(){
    fetch('./assets/sgwBusSchedule.json').then(res => res.json()).then(json =>{
      this.scheduleDataSGW = json;
      console.log(this.scheduleDataSGW.length);
    });
    
  }

  read_json_loyola(){
    fetch('./assets/loyolaBusSchedule.json').then(res => res.json()).then(json =>{
      this.scheduleDataLoy = json;
      console.log(this.scheduleDataLoy.length);
    });
  }

  async closeModal() {
      await this.modalController.dismiss();
    }
}
