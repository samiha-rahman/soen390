import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeSwitcherService } from './theme-switcher.service.spec';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettings implements OnInit {

  constructor(private modalController: ModalController, public themeSwitcher: ThemeSwitcherService, public alertController: AlertController) { }

  ngOnInit() {
  }
  async closeModal() {
    await this.modalController.dismiss();
  }

  async changeTheme(){
    this.themeSwitcher.cycleTheme();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
