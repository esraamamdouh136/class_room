import { TestBed } from '@angular/core/testing';

import { MotherCompaniseService } from './mother-companise.service';

describe('MotherCompaniseService', () => {
  let service: MotherCompaniseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotherCompaniseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
