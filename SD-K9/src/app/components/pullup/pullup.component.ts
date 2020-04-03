import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState} from 'ionic-pullup';
import { ModalController } from '@ionic/angular';
import { AppSettings } from 'src/app/pages/app-settings/app-settings.page';
import { BusPage} from 'src/app/pages/bus/bus.page';

@Component({
  selector: 'app-pullup',
  templateUrl: './pullup.component.html',
  styleUrls: ['./pullup.component.scss'],
})
export class PullupComponent implements OnInit {
  footerState: IonPullUpFooterState;




  constructor(public modalController: ModalController) { }

  async presentModal() {
      const modal = await this.modalController.create({
        component: AppSettings
      });
      return await modal.present();
    }

    async presentModal1() {
        const modal = await this.modalController.create({
          component: BusPage
        });
        return await modal.present();
      }

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }



  // optional capture events
    footerExpanded() {
        console.log('Footer expanded!');
    }

    // optional capture events
    footerCollapsed() {
        console.log('Footer collapsed!');
    }

    // toggle footer states
    toggleFooter() {
        this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    }
}
