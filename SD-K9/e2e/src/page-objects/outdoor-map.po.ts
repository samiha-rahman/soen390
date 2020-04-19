import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class OutdoorMapComponent extends PageObject { 
    constructor() {
        super('app-outdoor-map');
    }

    goToSGW() {
        this.clickButton(' ionic-segment-button#sgw-button');
    }

    goToLoyola() {
        this.clickButton(' ionic-segment-button#cc-button')
    }

    locateMe() {
        this.clickButton(' ion-fab-button.locate-me-btn');
    }

    loadMap() {
        const el = element(by.css('ion-fab-button.locate-me-btn'))
        browser.wait(ExpectedConditions.visibilityOf(el), 30000);
    }
}