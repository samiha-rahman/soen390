import { TestBed } from '@angular/core/testing';

import { DirectionFormStore } from './direction-form-store.service';

describe('DirectionFormStore', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DirectionFormStore = TestBed.get(DirectionFormStore);
        expect(service).toBeTruthy();
    });
});
