import { TestBed } from '@angular/core/testing';

import { ParentsListService } from './parents-list.service';

describe('ParentsListService', () => {
  let service: ParentsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
