import { browser, element, by } from "protractor"; 
import { PageObject } from './app.po';
import { HomePage } from './home.po';
import { TopDirectionsBarComponent } from './top-directions-bar.po';
import { OutdoorMapComponent } from './outdoor-map.po'


describe("Directions", () => {
  const home = new HomePage();
  const topDirectionsBar = new TopDirectionsBarComponent();
  const outdoorMap = new OutdoorMapComponent();

  beforeEach(() => {
    home.load();
  });

  describe("after launching the application", () => {
    it("displays the home page", () => {
      expect(home.rootElement().isPresent()).toEqual(true);
    });

    it("displays top directions bar", () => {
      expect(topDirectionsBar.rootElement().isPresent()).toEqual(true);
    });

    it("the page contains an area prompting user to enter starting point", () => {
      expect(element(by.css('top-directions-bar ion-searchbar#start-searchbar')).isDisplayed()).toBeTruthy;
    });

    it("the page displays an area prompting user to enter destination", () => {
      expect(element(by.css('top-directions-bar ion-searchbar#destination-searchbar')).isDisplayed()).toBeTruthy;
    });

  });
  
  describe("requesting an indoor route for source and destination on the same floor", () => {
    it("accepts input from the user and displays indoor map", () => {
      // outdoorMap.goToSGW();
      topDirectionsBar.enterStart('H-820');
      topDirectionsBar.enterDestination('H-860');
      expect(topDirectionsBar.rootElement().isPresent()).toEqual(true);
    });
  });

});
