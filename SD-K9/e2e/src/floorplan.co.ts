import { browser, by, element, ExpectedConditions } from 'protractor';
import { AppComponent } from './app.co';

export class FloorplanComponent extends AppComponent {
    constructor() {
        super('floor-plan');
    }
}