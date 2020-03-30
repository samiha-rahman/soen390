"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var app_po_1 = require("./app.po");
var LocationSearchPage = /** @class */ (function (_super) {
    tslib_1.__extends(LocationSearchPage, _super);
    function LocationSearchPage() {
        return _super.call(this, 'app-location-search') || this;
    }
    LocationSearchPage.prototype.enterLocation = function (location) {
        this.enterInputText(' ion-searchbar#location-searchbar', location);
    };
    // TODO: be able to click from a list of options 
    LocationSearchPage.prototype.chooseFromList = function () {
        // element(by.cssContainingText('ion-label', `${location}`)).click();
        this.clickButton(' ion-label'); // currently, only one option is displayed, so can select using ion-label
    };
    LocationSearchPage.prototype.searchAnyway = function () {
        this.clickButton(' ion-button');
    };
    return LocationSearchPage;
}(app_po_1.PageObject));
exports.LocationSearchPage = LocationSearchPage;
//# sourceMappingURL=location-search.po.js.map