import { browser, element, by } from "protractor"; 
import { HomePage } from './page-objects/home.po';
import { TopDirectionsBarComponent } from './page-objects/top-directions-bar.po';
import { OutdoorMapComponent } from './page-objects/outdoor-map.po';
import { LocationSearchPage } from './page-objects/location-search.po';
import { FloorplanComponent } from './page-objects/floor-plan.po';
import { MapBoxComponent } from './page-objects/map-box.po';

describe("indoor navigation", () => {
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
  
  describe("accepts input from the user and displays indoor map for start and destination on the same floor", () => {
    it("when inputs are in the drop down list", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-811');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      expect(floorplan.rootElement().isDisplayed()).toEqual(true);
    });

    it("when inputs are valid and not in the drop down list", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-820');
      locationSearch.searchAnyway();
      topDirectionsBar.waitUntilVisible();
      topDirectionsBar.enterDestination();
      locationSearch.waitUntilVisible();
      locationSearch.enterLocation('H-860');
      locationSearch.searchAnyway();
      floorplan.waitUntilVisible();
      expect(floorplan.rootElement().isDisplayed()).toEqual(true);
    });

  });

  describe("accepts input from the user and displays indoor map for start and destination on different floor", () => {
    it("when inputs are in the drop down list", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-617');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      expect(floorplan.rootElement().isDisplayed()).toEqual(true);
    });

    it("when inputs are valid and not in the drop down list", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-860');
      locationSearch.searchAnyway();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-620');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      expect(floorplan.rootElement().isDisplayed()).toEqual(true);
    });

  });

  describe("allows user to navigate between floors when start and destination are on different floors", () => {
    it("displays a button to navigate to the next floor", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-617');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      mapBox.waitUntilPresent();
      expect(element(by.css('app-map-box #nextmap-button')).isDisplayed()).toEqual(true);
    });

    it("displays a button to navigate to the previous floor", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-617');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      mapBox.waitUntilPresent();
      mapBox.clickNextMap();
      expect(element(by.css('app-map-box #prevmap-button')).isDisplayed()).toEqual(true);
    });

  });

  describe("verifies correct path is displayed for indoor map navigation", () => {
    it("displays shortest path between two classrooms on the same floor", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-811');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      floorplan.verifyPathSameFloor();
    });

    it("displays shortest path between two classrooms on different floors using escalator", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-617');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      mapBox.waitUntilPresent();

      topDirectionsBar.selectIndoorTransportationMode("escalator");

      floorplan.verifyPathToEscalator();
      mapBox.clickNextMap();
      floorplan.verifyPathFromEscalator();
    });

    it("displays shortest path between two classrooms on different floors using elevator", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-863');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-643');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      mapBox.waitUntilPresent();

      topDirectionsBar.selectIndoorTransportationMode("elevator");
      floorplan.verifyPathToElevator();
      mapBox.clickNextMap();
      floorplan.verifyPathFromElevator();

    });

    it("displays shortest path between two classrooms on different floors using stairs", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-863');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-643');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();
      mapBox.waitUntilPresent();

      topDirectionsBar.selectIndoorTransportationMode("stairs");
      floorplan.verifyPathToStairs();
      mapBox.clickNextMap();
      floorplan.verifyPathFromStairs();

    });

  });

  describe("verifies correct path when mix of indoor and outdoor route", () => {
    it("displays shortest path from class room in hall building to the loyola building", () => {
      // testing the happy path, will use escalators for vertical transport
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('CC-101');
      locationSearch.chooseFromList();
      floorplan.waitUntilVisible();

      // exiting the Hall building starting from Hall 8
      floorplan.verifyPathToEscalator();
      mapBox.clickNextMap();
      floorplan.waitUntilVisible();
      floorplan.verifyPathEscalators();
      mapBox.clickNextMap();
      floorplan.waitUntilVisible();
      floorplan.verifyPathToHallEntrance();
      mapBox.clickNextMap();

      // outdoor portion of the route will be displayed
      browser.sleep(3000);
      browser.driver.findElement(by.css("app-map-box #nextmap-button")).click();
      
      // verify that the indoor floorplan for loyola loads and displays shortest path to CC-101
      browser.sleep(3000);
      floorplan.verifyPathToLoyolaClass();

    });

  });

});
