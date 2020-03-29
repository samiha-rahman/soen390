import { browser, by, element, ExpectedConditions } from 'protractor';
import { AppPage } from './app.po';

export class HomePage extends AppPage {
    constructor() {
        super('app-home', '/home');
    }

    enterSource(source: string) {
        this.enterInputText('#source ion-input', source);
    }

    enterDestination(destination: string) {
        this.enterInputText('#destination ion-input', destination);
    }

    clickGetDirections() {
        this.clickButton('#getdirection-button');
    }

}