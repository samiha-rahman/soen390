import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class HomePage extends PageObject {
    constructor() {
        super('app-home', '/home');
    }

}