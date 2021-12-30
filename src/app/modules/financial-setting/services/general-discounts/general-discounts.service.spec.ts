import { TestBed } from '@angular/core/testing';

import { GeneralDiscountsService } from './general-discounts.service';

describe('GeneralDiscountsService', () => {
  let service: GeneralDiscountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralDiscountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
