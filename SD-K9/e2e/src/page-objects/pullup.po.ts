import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class PullUpComponent extends PageObject {
  constructor() {
    super('app-pullup');
  }

  openMenu() {
      this.clickButton(' ion-toolbar')
  }

  viewShuttleSchedule() {
      this.clickButton(' ion-button #shuttle-button')
  }

  viewAppSettings() {
      this.clickButton(' ion-button #settings-button')
  }
  
}