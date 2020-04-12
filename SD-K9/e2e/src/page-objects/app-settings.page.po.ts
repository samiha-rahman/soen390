import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class AppSettingsPage extends PageObject {
    constructor() {
        super('app-settings');
    }
}