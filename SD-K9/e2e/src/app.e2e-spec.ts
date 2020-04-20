import { browser, element, by, ExpectedConditions } from "protractor"; 
import { HomePage } from './page-objects/home.po';
import { TopDirectionsBarComponent } from './page-objects/top-directions-bar.po';
import { OutdoorMapComponent } from './page-objects/outdoor-map.po';
import { LocationSearchPage } from './page-objects/location-search.po';
import { PullUpComponent } from './page-objects/pullup.po';

describe("general application", () => {
  const home = new HomePage();
  const topDirectionsBar = new TopDirectionsBarComponent();
  const outdoorMap = new OutdoorMapComponent();
  const locationSearch = new LocationSearchPage();
  const pullUp = new PullUpComponent();

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

  describe("navigation", () => {
    it("hides top directions bar when clicking 'start'", () => {
      topDirectionsBar.enterStart();
      locationSearch.enterLocation('H-821');
      locationSearch.chooseFromList();
      topDirectionsBar.enterDestination();
      locationSearch.enterLocation('H-617');
      locationSearch.chooseFromList();
      topDirectionsBar.clickStart();
      browser.wait(
        ExpectedConditions.not(ExpectedConditions.presenceOf(element(by.css('top-directions-bar ion-searchbar#start-searchbar')))),
        3000
      );
      expect(element(by.css('top-directions-bar ion-searchbar#start-searchbar')).isPresent()).toEqual(false);
      expect(element(by.css('top-directions-bar ion-searchbar#destination-searchbar')).isPresent()).toEqual(false);
    });
  });

  describe("pull up menu", () => {
    it("contains a page for the shuttle bus schedule", () => {
      pullUp.openMenu();
      pullUp.viewShuttleSchedule();
      expect(browser.driver.findElement(by.css('app-bus.ion-page')).isDisplayed()).toEqual(true);
    });

    it("contains a page for the app settings", () => {
      pullUp.openMenu();
      pullUp.viewAppSettings();
      expect(browser.driver.findElement(by.css('app-settings')).isDisplayed()).toEqual(true);
    })

  });
});