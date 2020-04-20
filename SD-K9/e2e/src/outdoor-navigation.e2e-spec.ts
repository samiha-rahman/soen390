import { browser, element, by, ExpectedConditions } from "protractor"; 
import { HomePage } from './page-objects/home.po';
import { TopDirectionsBarComponent } from './page-objects/top-directions-bar.po';
import { OutdoorMapComponent } from './page-objects/outdoor-map.po';
import { LocationSearchPage } from './page-objects/location-search.po';


describe("outdoor navigation", () => {
  const home = new HomePage();
  const topDirectionsBar = new TopDirectionsBarComponent();
  const outdoorMap = new OutdoorMapComponent();
  const locationSearch = new LocationSearchPage();

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
      expect(outdoorMap.isSGWClickable()).toEqual(true);
    });

    it("button to toggle to Loyola campus is clickable", () => {
      expect(outdoorMap.isLoyolaClickable()).toEqual(true);
    });

    it("button to locate user is clickable", () => {
      expect(outdoorMap.isLocateMeClickable()).toEqual(true);
    });

  });

});