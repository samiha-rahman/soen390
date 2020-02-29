import { TestBed } from '@angular/core/testing';

import { Location } from '../helpers/location';
import { HttpClientModule } from '@angular/common/http';
import { SVGManager } from './svg-manager.service';

describe('SVGManager', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                SVGManager,
                Location
            ]
        }).compileComponents();
    });

    it('should be created', () => {
        const service: SVGManager = TestBed.get(SVGManager);
        expect(service).toBeTruthy();
    });
});