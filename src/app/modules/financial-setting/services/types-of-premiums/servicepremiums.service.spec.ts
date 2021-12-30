import { TestBed } from '@angular/core/testing';

import { ServicepremiumsService } from './servicepremiums.service';

describe('ServicepremiumsService', () => {
  let service: ServicepremiumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicepremiumsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
