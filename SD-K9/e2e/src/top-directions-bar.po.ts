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

    goBack() {
        this.clickButton(' ion-button.clear-btn');
    }

    selectIndoorTransportationMode(mode: string) {
        switch (mode) {
            case "stairs":
                this.clickButton(' ion-segment-button#stairs-button');
                break;
        
            case "escalator":
                this.clickButton(' ion-segment-button#escalator-button');
                break;

            case "elevator":
                this.clickButton(' ion-segment-button#elevator-button');
                break;

            default:
                fail("could not find transportation mode");
                break;
        }
    }

}