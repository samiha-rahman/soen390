import { browser, element, by, ExpectedConditions } from "protractor"; 
import { PageObject } from './page-objects/app.po';
import { HomePage } from './page-objects/home.po';
import { TopDirectionsBarComponent } from './page-objects/top-directions-bar.po';
import { OutdoorMapComponent } from './page-objects/outdoor-map.po';
import { LocationSearchPage } from './page-objects/location-search.po';
import { FloorplanComponent } from './page-objects/floor-plan.po';
import { MapBoxComponent } from './page-objects/map-box.po';

describe("outdoor navigation", () => {
  const home = new HomePage();
  const topDirectionsBar = new TopDirectionsBarComponent();
  const outdoorMap = new OutdoorMapComponent();
  const locationSearch = new LocationSearchPage();
  const floorplan = new FloorplanComponent();
  const mapBox = new MapBoxComponent();

  beforeAll(() => {
    home.load();
    // in order for the indoor map to visibly appear during the test run, the outdoor map has to properly be loaded before executing any tests
    topDirectionsBar.enterStart();
    locationSearch.goBack();
    outdoorMap.loadMap();
  });

  beforeEach(() => {
    home.load();
  });

  describe("user interactions on outdoor map", () => {
    it("button to toggle to SGW campus is clickable", () => {
      const sgwButton = element(by.cssContainingText('ion-label', 'SGW'));
      expect(ExpectedConditions.elementToBeClickable(sgwButton)).toEqual(true);

    });

    it("button to toggle to Loyola campus is clickable", () => {
      const loyButton = element(by.cssContainingText('ion-label', 'Loyola'));
      expect(ExpectedConditions.elementToBeClickable(loyButton)).toEqual(true);
    });

    it("button to locate user is clickable", () => {
      const locateMe = element(by.css('ion-fab-button.locate-me-btn'));
      expect(ExpectedConditions.elementToBeClickable(locateMe));
    });

  });

});