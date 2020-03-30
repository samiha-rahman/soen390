"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var app_po_1 = require("./app.po");
var TopDirectionsBarComponent = /** @class */ (function (_super) {
    tslib_1.__extends(TopDirectionsBarComponent, _super);
    function TopDirectionsBarComponent() {
        return _super.call(this, 'top-directions-bar') || this;
    }
    TopDirectionsBarComponent.prototype.enterStart = function () {
        this.clickButton(' ion-searchbar#start-searchbar');
    };
    TopDirectionsBarComponent.prototype.enterDestination = function () {
        this.clickButton(' ion-searchbar#destination-searchbar');
    };
    return TopDirectionsBarComponent;
}(app_po_1.PageObject));
exports.TopDirectionsBarComponent = TopDirectionsBarComponent;
//# sourceMappingURL=top-directions-bar.po.js.map