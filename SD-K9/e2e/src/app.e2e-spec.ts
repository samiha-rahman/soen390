import { browser, element, by } from "protractor"; 
import { AppPage } from './app.po';
import { HomePage } from './home.po';
import { AppComponent } from './app.co';
import { FloorplanComponent } from './floorplan.co';
import { MapBoxComponent } from './mapbox.co'

describe("Directions", () => {
  const home = new HomePage();
  const floorplan = new FloorplanComponent();
  const mapbox = new MapBoxComponent();

  beforeEach(() => {
    home.load();
  });

  describe("after launching the application", () => {
    it("displays the home page", () => {
      expect(home.rootElement().isPresent()).toEqual(true);
    });

    it("the page contains an area prompting user to enter starting point", () => {
      expect(element(by.css(`app-home #source ion-label`)).getText()).toContain("Choose starting point");
    });

    it("the page contains an input area to enter starting point", () => {
      expect(element(by.css(`app-home #source ion-input`)).getAttribute("formControlName")).toEqual("source");
    });

    it("the page displays an area prompting user to enter destination", () => {
      expect(element(by.css(`app-home #destination ion-label`)).getText()).toContain("Choose destination");
    });

    it("the page contains an input area to enter destination", () => {
      expect(element(by.css(`app-home #destination ion-input`)).getAttribute("formControlName")).toEqual("destination");
    });
  });
  
  describe("requesting an indoor route for source and destination on the same floor", () => {
    it("accepts input from the user and displays indoor map", () => {
      home.enterSource('H-820');
      home.enterDestination('H-860');
      home.clickGetDirections();
      floorplan.waitUntilVisible();
      expect(element(by.deepCss(`#floorplan`)).isDisplayed()).toBeTruthy;
      // expect(floorplan.rootElement().isDisplayed()).toBeTruthy;
    });
  });

  describe("requesting an indoor route for source and destination on different floors", () => {
    it("accepts input from the user and displays indoor map", () => {
      home.enterSource('H-620');
      home.enterDestination('H-860');
      home.clickGetDirections();
      expect(element(by.css(`app-home #mapbox floor-plan`)).isDisplayed()).toBeTruthy;
    });

    it("displays the next map button", () => {
      home.enterSource('H-620');
      home.enterDestination('H-860');
      home.clickGetDirections();
      expect(element(by.css(`app-home #mapbox.nextmap-button`)).isDisplayed()).toBeTruthy;
    });
  });

});
