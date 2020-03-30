import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class FloorplanComponent extends PageObject {
    constructor() {
        super('floor-plan');
    }

}