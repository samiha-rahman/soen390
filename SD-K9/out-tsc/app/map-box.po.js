"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var app_po_1 = require("./app.po");
var MapBoxComponent = /** @class */ (function (_super) {
    tslib_1.__extends(MapBoxComponent, _super);
    function MapBoxComponent() {
        return _super.call(this, 'app-map-box') || this;
    }
    MapBoxComponent.prototype.clickNextMap = function () {
        this.clickButton('#nextmap-button');
    };
    MapBoxComponent.prototype.clickPrevMap = function () {
        this.clickButton('#prevmap-button');
    };
    return MapBoxComponent;
}(app_po_1.PageObject));
exports.MapBoxComponent = MapBoxComponent;
//# sourceMappingURL=map-box.po.js.map