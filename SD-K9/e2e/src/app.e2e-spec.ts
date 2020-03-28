import { browser, element, by } from "protractor"; 
import { AppPage } from './app.po';
import { HomePage } from './home.po';

describe("Directions", () => {
  const home = new HomePage();

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
  
});
