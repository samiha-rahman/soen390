import { browser, by, element, ExpectedConditions } from 'protractor';
import { AppComponent } from './app.co';

export class MapBoxComponent extends AppComponent {
  constructor() {
    super('app-map-box');
  }

  clickNextMap() {
    this.clickButton('#nextmap-button');
  }

  clickPrevMap() {
    this.clickButton('#prevmap-button');
  }

}