"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var home_po_1 = require("./home.po");
var top_directions_bar_po_1 = require("./top-directions-bar.po");
var outdoor_map_po_1 = require("./outdoor-map.po");
var location_search_po_1 = require("./location-search.po");
var floor_plan_po_1 = require("./floor-plan.po");
var map_box_po_1 = require("./map-box.po");
describe("Directions", function () {
    var home = new home_po_1.HomePage();
    var topDirectionsBar = new top_directions_bar_po_1.TopDirectionsBarComponent();
    var outdoorMap = new outdoor_map_po_1.OutdoorMapComponent();
    var locationSearch = new location_search_po_1.LocationSearchPage();
    var floorplan = new floor_plan_po_1.FloorplanComponent();
    var mapBox = new map_box_po_1.MapBoxComponent();
    beforeEach(function () {
        home.load();
    });
    describe("after launching the application", function () {
        it("displays the home page", function () {
            expect(home.rootElement().isPresent()).toEqual(true);
        });
        it("displays top directions bar", function () {
            expect(topDirectionsBar.rootElement().isPresent()).toEqual(true);
        });
        it("the page contains an area prompting user to enter starting point", function () {
            expect(protractor_1.element(protractor_1.by.css('top-directions-bar ion-searchbar#start-searchbar')).isDisplayed()).toBeTruthy;
        });
        it("the page displays an area prompting user to enter destination", function () {
            expect(protractor_1.element(protractor_1.by.css('top-directions-bar ion-searchbar#destination-searchbar')).isDisplayed()).toBeTruthy;
        });
    });
    describe("accepts input from the user and displays indoor map for start and destination on the same floor", function () {
        it("when inputs are in the drop down list", function () {
            topDirectionsBar.enterStart();
            locationSearch.enterLocation('H-821');
            locationSearch.chooseFromList();
            topDirectionsBar.enterDestination();
            locationSearch.enterLocation('H-811');
            locationSearch.chooseFromList();
            mapBox.waitUntilPresent();
            expect(mapBox.rootElement().isPresent()).toEqual(true);
        });
        it("when inputs are valid and not in the drop down list", function () {
            topDirectionsBar.enterStart();
            locationSearch.enterLocation('H-820');
            locationSearch.searchAnyway();
            topDirectionsBar.enterDestination();
            locationSearch.enterLocation('H-860');
            locationSearch.searchAnyway();
            mapBox.waitUntilPresent();
            expect(mapBox.rootElement().isPresent()).toEqual(true);
        });
    });
    describe("accepts input from the user and displays indoor map for start and destination on different floor", function () {
        it("when inputs are in the drop down list", function () {
            topDirectionsBar.enterStart();
            locationSearch.enterLocation('H-821');
            locationSearch.chooseFromList();
            topDirectionsBar.enterDestination();
            locationSearch.enterLocation('H-617');
            locationSearch.chooseFromList();
            mapBox.waitUntilPresent();
            expect(mapBox.rootElement().isPresent()).toEqual(true);
        });
        it("when inputs are valid and not in the drop down list", function () {
            topDirectionsBar.enterStart();
            locationSearch.enterLocation('H-860');
            locationSearch.searchAnyway();
            topDirectionsBar.enterDestination();
            locationSearch.enterLocation('H-620');
            locationSearch.searchAnyway();
            mapBox.waitUntilPresent();
            expect(mapBox.rootElement().isPresent()).toEqual(true);
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map