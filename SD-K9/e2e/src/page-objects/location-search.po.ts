import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class LocationSearchPage extends PageObject {
    constructor() {
        super('app-location-search');
    }

    enterLocation(location: string) {
        this.slowType(' ion-searchbar#location-searchbar', location, 100);
    }

    chooseFromList() {
        this.clickButton(' ion-label#list-item');    
    }

    choosePlacesFromList() {
        this.clickButton(' ion-label#places-item')
    }

    searchAnyway() {
        this.clickButton(' ion-button#searchanyway-button');
    }

    goBack() {
        this.clickButton(' ion-fab-button#back-button');
    }

    clickLocationSearchbar() {
        this.clickButton(' ion-searchbar#location-searchbar')
    }

}