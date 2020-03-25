import { TestBed } from '@angular/core/testing';

import { Location } from '../helpers/location';
import { HttpClientModule } from '@angular/common/http';
import { SVGManager } from './svg-manager.service';

describe('SVGManager', () => {
    let service: SVGManager;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                SVGManager,
                Location
            ]
        }).compileComponents();
        service = TestBed.get(SVGManager);
    });

    afterEach(() => {
        service = null;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});