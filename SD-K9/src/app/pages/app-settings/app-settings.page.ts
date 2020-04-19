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
      subHeader: 'Privacy Policy',
      message: 'It is NavConU\'s policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to www.NavConU.com (hereinafter, "us", "we", or "www.NavConU.com"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
