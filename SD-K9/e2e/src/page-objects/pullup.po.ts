import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class PullUpComponent extends PageObject {
  constructor() {
    super('app-pullup');
  }

  openMenu() {
    browser.driver.findElement(by.css('div.footer')).click();
    browser.sleep(3000);
  }

  async viewShuttleSchedule() {
    await browser.driver.findElement(by.css('ion-button#shuttle-button')).click();
    browser.sleep(3000);
  }

  async viewAppSettings() {
    await browser.driver.findElement(by.css('ion-button#settings-button')).click();
    browser.sleep(3000);
  }
  
}