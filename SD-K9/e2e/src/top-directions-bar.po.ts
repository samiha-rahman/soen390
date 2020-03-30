import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class TopDirectionsBarComponent extends PageObject {
    constructor() {
        super('top-directions-bar');
    }

    enterStart() {
        this.clickButton(' ion-searchbar#start-searchbar');
    }

    enterDestination() {
        this.clickButton(' ion-searchbar#destination-searchbar');
    }

}