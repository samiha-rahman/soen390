import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class BusPage extends PageObject {
    constructor() {
        super('app-bus');
    }
}