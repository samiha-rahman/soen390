import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObject } from './app.po';

export class FloorplanComponent extends PageObject {
    // the points that consistitute the path drawn from H-821 to H-811
    private correctPathSameFloor = "209,482 209,478 209,474 209,470 204,465 200,465 196,465 192,465 187,465 183,465 179,465 175,465 171,465 167,465 163,465 159,465 155,465 151,465 147,465 143,465 139,465 135,465 131,465 127,465 123,465 119,465 112,465 108,465 104,461 104,457 104,453 104,449 104,444 104,440 104,436 104,432 104,428 104,424 104,420 104,416 104,412 104,408 104,404 104,400 104,396 104,392 104,388 104,384 99,380 95,380 90,380 86,380 ";

    constructor() {
        super('floor-plan');
    }

    async verifyPathSameFloor() {
        const pathDrawn = await element(by.css('polyline.path'));
        expect(this.correctPathSameFloor == pathDrawn).toBeTruthy; 
    }

}