import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class OutdoorMapComponent extends PageObject { 
    constructor() {
        super('app-outdoor-map');
    }

    goToSGW() {
        browser.driver.findElement(by.id('sgw-button')).click();
    }

    async isSGWClickable() {
        var clickable: boolean;
        await browser.driver.findElement(by.id('sgw-button')).click().then(function (fnct) {
        clickable = true;
      });

      return clickable;
    }

    goToLoyola() {
        browser.driver.findElement(by.id('cc-button')).click();
    }

    async isLoyolaClickable() {
        var clickable: boolean;
        await browser.driver.findElement(by.id('cc-button')).click().then(function (fnct) {
        clickable = true;
      });

      return clickable;
    }

    locateMe() {
        browser.driver.findElement(by.css('ion-fab-button.locate-me-btn')).click();
    }

    async isLocateMeClickable() {
        var clickable: boolean;
        await browser.driver.findElement(by.css('ion-fab-button.locate-me-btn')).click().then(function (fnct) {
        clickable = true;
      });

      return clickable;
    }

    loadMap() {
        const el = element(by.css('ion-fab-button.locate-me-btn'))
        browser.wait(ExpectedConditions.visibilityOf(el), 30000);
    }
}