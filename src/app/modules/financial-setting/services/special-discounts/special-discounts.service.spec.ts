import { TestBed } from '@angular/core/testing';

import { SpecialDiscountsService } from './special-discounts.service';

describe('SpecialDiscountsService', () => {
  let service: SpecialDiscountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialDiscountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
