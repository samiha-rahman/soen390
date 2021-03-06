import { browser, element, by, ExpectedConditions } from "protractor"; 
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
      expect(outdoorMap.isSGWClickable()).toEqual(true);
    });

    it("button to toggle to Loyola campus is clickable", () => {
      expect(outdoorMap.isLoyolaClickable()).toEqual(true);
    });

    it("button to locate user is clickable", () => {
      expect(outdoorMap.isLocateMeClickable()).toEqual(true);
    });

  });

  describe("different outdoor transportation methods", () => {
    it("has all options for outdoor navigation", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-109');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('CC-101');
      locationSearch.chooseFromList();

      browser.sleep(3000);

      expect(topDirectionsBar.selectOutdoorTransportationMode("bicycle")).toEqual(true);
      expect(topDirectionsBar.selectOutdoorTransportationMode("walk")).toEqual(true);
      expect(topDirectionsBar.selectOutdoorTransportationMode("drive")).toEqual(true);
      expect(topDirectionsBar.selectOutdoorTransportationMode("transit")).toEqual(true);
      expect(topDirectionsBar.selectOutdoorTransportationMode("shuttle")).toEqual(true);
    })
  })

});