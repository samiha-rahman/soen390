import { browser, element, by } from "protractor"; 
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
    browser.sleep(5000);
  });

  beforeEach(() => {
    home.load();
  });

  describe("campus and building information", () => {
    it("campus buildings are highlighted", () => {
        outdoorMap.goToSGW();

    });
  });

});