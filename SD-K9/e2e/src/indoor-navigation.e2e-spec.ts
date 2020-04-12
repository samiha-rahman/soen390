import { browser, element, by } from "protractor"; 
import { PageObject } from './app.po';
import { HomePage } from './home.po';
import { TopDirectionsBarComponent } from './top-directions-bar.po';
import { OutdoorMapComponent } from './outdoor-map.po';
import { LocationSearchPage } from './location-search.po';
import { FloorplanComponent } from './floor-plan.po';
import { MapBoxComponent } from './map-box.po';

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
    browser.sleep(5000);
  });

  beforeEach(() => {
    home.load();
  });

  describe("after launching the application", () => {
    it("displays the home page", () => {
      expect(home.rootElement().isPresent()).toEqual(true);
    });

    it("displays the outdoor map", () => {
      expect(outdoorMap.rootElement().isDisplayed()).toEqual(true);
    })

    it("displays top directions bar", () => {
      expect(topDirectionsBar.rootElement().isPresent()).toEqual(true);
    });

    it("the page contains an area prompting user to enter starting point", () => {
      expect(element(by.css('top-directions-bar ion-searchbar#start-searchbar')).isDisplayed()).toEqual(true);
    });

    it("the page displays an area prompting user to enter destination", () => {
      expect(element(by.css('top-directions-bar ion-searchbar#destination-searchbar')).isDisplayed()).toEqual(true);
    });

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
      topDirectionsBar.enterDestination();
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
      locationSearch.searchAnyway();
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

      // TODO: complete when indoor navigation modes are completed
      // topDirectionsBar.selectIndoorTransportationMode("escalator");

      floorplan.verifyPathToEscalator();
      mapBox.clickNextMap();
      floorplan.verifyPathFromEscalator();
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
      browser.sleep(5000);
      mapBox.clickNextMap();
      
      // verify that the indoor floorplan for loyola loads and displays shortest path to CC-101
      floorplan.waitUntilVisible();
      floorplan.verifyPathToLoyolaClass();

    });

  });

});
