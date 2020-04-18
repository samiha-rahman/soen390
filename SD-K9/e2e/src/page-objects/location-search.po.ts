import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class LocationSearchPage extends PageObject {
    constructor() {
        super('app-location-search');
    }

    enterLocation(location: string) {
        this.slowType(' ion-searchbar#location-searchbar', location, 100);
    }

    // TODO: be able to click from a list of options 
    chooseFromList() {
        // var elem = element(by.css('[*ngIf="itemList && itemList.length > 0"]'));
        // elem.isPresent().then(function (appears) {
        //     if (appears) {
        //         this.clickButton(' ion-label');
        //     }
        // });
        // element(by.cssContainingText('ion-label', `${location}`)).click();
        // browser.sleep(10000);
        // browser.driver.findElement({id:'list-item'}).click();
        this.clickButton(' ion-label#list-item');     // currently, only one option is displayed, so can select using ion-label
    }

    searchAnyway() {
        this.clickButton(' ion-button#searchanyway-button');
    }

    goBack() {
        this.clickButton(' ion-fab-button#back-button');
    }

}