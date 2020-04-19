import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class OutdoorMapComponent extends PageObject {
    constructor() {
        super('app-building-info');
    }
}