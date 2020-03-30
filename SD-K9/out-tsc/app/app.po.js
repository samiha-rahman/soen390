"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var PageObject = /** @class */ (function () {
    function PageObject(tag, path) {
        this.tag = tag;
        this.path = path;
    }
    PageObject.prototype.load = function () {
        return protractor_1.browser.get(this.path);
    };
    PageObject.prototype.rootElement = function () {
        return protractor_1.element(protractor_1.by.css(this.tag));
    };
    PageObject.prototype.waitUntilInvisible = function () {
        protractor_1.browser.wait(protractor_1.ExpectedConditions.invisibilityOf(this.rootElement()), 3000);
    };
    PageObject.prototype.waitUntilPresent = function () {
        protractor_1.browser.wait(protractor_1.ExpectedConditions.presenceOf(this.rootElement()), 3000);
    };
    PageObject.prototype.waitUntilNotPresent = function () {
        protractor_1.browser.wait(protractor_1.ExpectedConditions.not(protractor_1.ExpectedConditions.presenceOf(this.rootElement())), 3000);
    };
    PageObject.prototype.waitUntilVisible = function () {
        protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.rootElement()), 3000);
    };
    PageObject.prototype.getTitle = function () {
        return protractor_1.element(protractor_1.by.css(this.tag + " ion-title")).getText();
    };
    PageObject.prototype.enterInputText = function (sel, text) {
        var el = protractor_1.element(protractor_1.by.css("" + this.tag + sel));
        var inp = el.element(protractor_1.by.css('input'));
        inp.sendKeys(text);
    };
    PageObject.prototype.enterTextareaText = function (sel, text) {
        var el = protractor_1.element(protractor_1.by.css("" + this.tag + sel));
        var inp = el.element(protractor_1.by.css('textarea'));
        inp.sendKeys(text);
    };
    PageObject.prototype.clickButton = function (sel) {
        var el = protractor_1.element(protractor_1.by.css("" + this.tag + sel));
        protractor_1.browser.wait(protractor_1.ExpectedConditions.elementToBeClickable(el));
        el.click();
    };
    PageObject.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    PageObject.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.deepCss('app-root ion-content')).getText();
    };
    return PageObject;
}());
exports.PageObject = PageObject;
//# sourceMappingURL=app.po.js.map