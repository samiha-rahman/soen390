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

    async selectOutdoorTransportationMode(mode: string) {
        var clickable: boolean;
        switch (mode) {
            case "bicycle":
                await element(by.css('ion-segment-button#bike-button')).click().then(function (fnct){
                    clickable = true;
                });
                break;
        
            case "drive":
                await element(by.css('ion-segment-button#drive-button')).click().then(function (fnct){
                    clickable = true;
                });
                break;

            case "walk":
                await element(by.css('ion-segment-button#walk-button')).click().then(function (fnct){
                    clickable = true;
                });
                break;

            case "transit":
                await element(by.css('ion-segment-button#transit-button')).click().then(function (fnct){
                    clickable = true;
                });
                break;    
                
            case "shuttle":
                await element(by.css('ion-segment-button#shuttlebus-button')).click().then(function (fnct){
                    clickable = true;
                });
                break;

            default:
                fail("could not find transportation mode");
                break;
        }

        return clickable;
    }

}