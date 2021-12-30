import { TestBed } from '@angular/core/testing';

import { ValidateManagmentService } from './validate-managment.service';

describe('ValidateManagmentService', () => {
  let service: ValidateManagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateManagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
