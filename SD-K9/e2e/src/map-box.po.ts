import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class MapBoxComponent extends PageObject {
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