import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class OutdoorMapComponent extends PageObject { 
    constructor() {
        super('app-outdoor-map');
    }

    // loadMap() {
    //     const el = element(by.css('app-outdoor-map div#map'))
    //     browser.wait(ExpectedConditions.visibilityOf(el), 10000);
    // }

    goToSGW() {
        this.clickButton(' ionic-segment-button#sgw-button');
    }

    goToLoyola() {
        this.clickButton(' ionic-segment-button#cc-button')
    }
}