"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var app_po_1 = require("./app.po");
var OutdoorMapComponent = /** @class */ (function (_super) {
    tslib_1.__extends(OutdoorMapComponent, _super);
    function OutdoorMapComponent() {
        return _super.call(this, 'app-outdoor-map') || this;
    }
    OutdoorMapComponent.prototype.goToSGW = function () {
        this.clickButton(' ionic-segment-button#sgw-button');
    };
    OutdoorMapComponent.prototype.goToLoyola = function () {
        this.clickButton(' ionic-segment-button#cc-button');
    };
    return OutdoorMapComponent;
}(app_po_1.PageObject));
exports.OutdoorMapComponent = OutdoorMapComponent;
//# sourceMappingURL=outdoor-map.po.js.map