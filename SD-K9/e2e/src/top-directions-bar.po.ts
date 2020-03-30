import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class TopDirectionsBarComponent extends PageObject {
    constructor() {
        super('top-directions-bar');
    }

    enterStart(start: string) {
        this.enterInputText(' ion-searchbar#start-searchbar', start);
    }

    enterDestination(destination: string) {
        this.enterInputText(' ion-searchbar#destination-searchbar', destination);
    }

}