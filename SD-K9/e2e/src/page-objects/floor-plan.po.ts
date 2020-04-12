import { browser, by, element, ExpectedConditions, promise } from 'protractor';
import { PageObject } from './app.po';
import { __values } from 'tslib';

export class FloorplanComponent extends PageObject {
    // the points that consistitute the path drawn from H-821 to H-811
    private correctPathSameFloor = "209,482 209,478 209,474 209,470 204,465 200,465 196,465 192,465 187,465 183,465 179,465 175,465 171,465 167,465 163,465 159,465 155,465 151,465 147,465 143,465 139,465 135,465 131,465 127,465 123,465 119,465 112,465 108,465 104,461 104,457 104,453 104,449 104,444 104,440 104,436 104,432 104,428 104,424 104,420 104,416 104,412 104,408 104,404 104,400 104,396 104,392 104,388 104,384 99,380 95,380 90,380 86,380 ";

    // the points that constitute the path drawn from H-821 to the escalator 
    private correctPathToEscalator = "307,240 303,240 298,240 294,240 290,240 286,240 282,244 282,248 282,252 282,256 282,260 282,264 282,269 282,273 282,277 282,281 282,285 282,289 282,293 282,297 282,301 282,305 282,309 282,313 282,317 282,321 282,325 282,330 282,334 282,338 282,342 282,346 282,350 282,354 282,358 282,362 282,366 282,370 282,374 282,378 282,382 282,386 282,390 282,394 282,398 282,402 282,406 282,410 282,414 282,418 282,422 282,426 282,430 282,434 282,438 282,442 282,446 282,450 282,454 282,461 278,465 274,465 270,465 266,465 262,465 258,465 254,465 247,465 243,465 239,465 235,465 231,465 224,465 220,465 216,465 209,465 204,465 200,465 196,465 192,465 187,465 183,465 179,465 175,465 171,465 167,465 163,465 159,465 155,465 151,465 147,465 143,465 139,465 135,465 131,465 127,465 123,465 119,465 112,465 108,465 104,461 104,457 104,453 104,449 104,444 104,440 104,436 104,432 104,428 104,424 104,420 104,416 104,412 104,408 104,404 104,400 104,396 104,392 104,388 104,384 99,380 95,380 90,380 86,380 ";

    // the points that constitute the path drawn from H-821 to the stairs 
    private correctPathToStairs = "";

    // the points that constitute the path drawn from H-821 to the elevator
    private correctPathToElevator = "";

    // the points that constitute the path drawn from escalator to H-617
    private correctPathFromEscalator = "86,491 90,491 94,488 94,484 94,480 94,476 94,472 99,469 104,465 108,465 112,465 116,465 123,465 127,465 131,465 135,465 139,465 143,465 147,465 151,465 155,465 159,465 163,465 167,465 171,465 175,465 179,465 183,465 187,465 192,465 196,465 200,465 204,465 209,465 216,465 220,465 224,465 228,465 235,465 239,465 243,465 247,465 251,465 258,465 262,465 266,465 270,465 274,465 278,465 282,461 282,457 282,450 282,446 282,442 282,438 282,434 282,430 282,426 282,422 282,418 282,414 282,410 282,406 282,402 282,398 282,394 282,390 282,386 282,382 282,378 282,374 282,370 282,366 282,362 282,358 282,354 282,350 282,346 282,342 282,338 282,334 282,330 282,325 282,321 282,317 282,313 282,309 282,305 282,301 282,297 282,293 282,289 282,285 282,281 282,277 282,273 282,269 282,264 282,260 282,256 282,252 282,248 282,244 286,240 290,240 294,240 298,240 303,240 307,240 ";

    // the points that constitute the path drawn from the stairs to H-617
    private correctPathFromStairs = "";

    // the points that constitute the path drawn from the elevator to H-617
    private correctPathFromElevator = "";

    // the points that constitute the path drawn connecting escalators on Hall 1 to Hall 2
    private correctPathEscalatorToEscalator = "634,795 634,790 634,785 634,779 634,774 634,769 634,764 632,758 627,758 622,758 617,758 612,758 607,758 602,758 597,758 594,758 587,758 582,758 577,758 572,758 567,758 562,758 557,758 552,758 547,758 542,758 538,753 538,748 ";

    // the points that constitute the path drawn from escalator on Hall 1 to Hall entrance
    private correctPathHallFirstToEntrance = "338,582 338,577 338,572 338,567 338,562 338,557 338,551 338,546 338,541 338,536 338,531 338,526 338,521 338,516 338,511 343,506 348,506 353,506 358,506 363,506 368,506 373,506 378,506 384,506 389,506 394,506 399,506 404,506 409,506 414,506 419,506 424,506 429,506 434,506 439,506 444,506 449,506 454,506 459,506 464,506 469,506 474,506 479,506 484,506 489,506 494,506 499,506 504,506 509,506 514,501 514,496 514,491 514,486 514,481 514,476 514,470 519,464 524,464 529,464 534,464 539,464 544,464 549,464 554,464 559,464 565,464 570,464 575,464 580,464 585,464 590,464 595,464 599,461 599,456 599,451 ";
    
    // the points that constitute the path drawn from Loyola entrance to CC-101
    private correctPathToLoyolaClass = "79,82 79,87 79,92 79,97 79,102 79,107 79,112 79,117 79,122 79,127 79,132 79,138 79,143 79,148 79,153 79,158 79,163 79,168 79,173 79,178 79,183 79,188 79,193 79,198 79,203 79,208 79,213 79,218 79,223 79,228 79,233 79,238 79,243 79,248 79,253 79,258 79,263 79,269 79,274 79,279 79,284 79,289 79,294 79,299 79,304 ";
    
    constructor() {
        super('floor-plan');
    }

    async _getPathDrawn() {
        var pathDrawn: string;
        await element(by.css('polyline.path')).getAttribute('points').then(function (value) {
            pathDrawn = value;
        });

        return pathDrawn;
    }

    async _getPathDrawnDriver() {
        var pathDrawn: string;
        await (await browser.driver.findElement(by.css('polyline.path'))).getAttribute('points').then(function (value) {
            pathDrawn = value;
        });

        return pathDrawn;
    }

    async verifyPathSameFloor() {
        expect(await this._getPathDrawn() == this.correctPathSameFloor).toEqual(true);
    }

    async verifyPathToEscalator() {
        expect(await this._getPathDrawn() == this.correctPathToEscalator).toEqual(true);
    }

    async verifyPathFromEscalator() {
        expect(await this._getPathDrawn() == this.correctPathFromEscalator).toEqual(true);
    }

    async verifyPathToStairs() {
        expect(await this._getPathDrawn() == this.correctPathToStairs).toEqual(true);
    }

    async verifyPathFromStairs() {
        expect(await this._getPathDrawn() == this.correctPathFromStairs).toEqual(true);
    }

    async verifyPathToElevator() {
        expect(await this._getPathDrawn() == this.correctPathToElevator).toEqual(true);
    }

    async verifyPathFromElevator() {
        expect(await this._getPathDrawn() == this.correctPathFromElevator).toEqual(true);
    }

    async verifyPathEscalators() {
        expect(await this._getPathDrawn() == this.correctPathEscalatorToEscalator).toEqual(true);
    }

    async verifyPathToHallEntrance() {
        expect(await this._getPathDrawn() == this.correctPathHallFirstToEntrance).toEqual(true);
    }

    async verifyPathToLoyolaClass() { 
        expect(await this._getPathDrawnDriver() == this.correctPathToLoyolaClass).toEqual(true);
    }

}