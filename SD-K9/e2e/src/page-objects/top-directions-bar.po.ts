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

    clickStart() {
        this.clickButton(' ion-button#start-button');
    }

    selectIndoorTransportationMode(mode: string) {
        switch (mode) {
            case "stairs":
                const stairsButton = element(by.cssContainingText('ion-button', 'STAIRS'));
                stairsButton.click();
                break;
        
            case "escalator":
                const escalatorButton = element(by.cssContainingText('ion-button', 'ESCALATORS'));
                escalatorButton.click();
                break;

            case "elevator":
                const elevatorButton = element(by.cssContainingText('ion-button', 'ELEVATORS'));
                elevatorButton.click();
                break;

            default:
                fail("could not find transportation mode");
                break;
        }
    }

    selectOutdoorTransportationMode(mode: string) {
        switch (mode) {
            case "bicycle":
                this.clickButton(' ion-segment-button#bike-button');
                break;
        
            case "drive":
                this.clickButton(' ion-segment-button#drive-button');
                break;

            case "walk":
                this.clickButton(' ion-segment-button#walk-button');
                break;

            case "transit":
                this.clickButton(' ion-segment-button#transit-button');
                break;     

            default:
                fail("could not find transportation mode");
                break;
        }
    }

}