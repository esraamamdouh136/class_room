import { TestBed } from '@angular/core/testing';

import { FicalYearService } from './fical-year.service';

describe('FicalYearService', () => {
  let service: FicalYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicalYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
