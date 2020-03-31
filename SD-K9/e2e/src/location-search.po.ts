import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class LocationSearchPage extends PageObject {
    constructor() {
        super('app-location-search');
    }

    enterLocation(location: string) {
        this.enterInputText(' ion-searchbar#location-searchbar', location);
    }

    // TODO: be able to click from a list of options 
    chooseFromList() {
        // element(by.cssContainingText('ion-label', `${location}`)).click();
        this.clickButton(' ion-label');     // currently, only one option is displayed, so can select using ion-label
    }

    searchAnyway() {
        this.clickButton(' ion-button');
    }

}