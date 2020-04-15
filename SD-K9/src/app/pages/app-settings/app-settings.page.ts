import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeSwitcherService } from './theme-switcher.service.spec';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettings implements OnInit {

  constructor(private modalController: ModalController, public themeSwitcher: ThemeSwitcherService) { }

  ngOnInit() {
  }
  async closeModal() {
    await this.modalController.dismiss();
  }

  async changeTheme(){
    this.themeSwitcher.cycleTheme();
  }

}
