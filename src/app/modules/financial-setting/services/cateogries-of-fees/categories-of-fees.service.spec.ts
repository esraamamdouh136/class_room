import { TestBed } from '@angular/core/testing';

import { categoriesFeesService } from './categories-of-fees.service';

describe('CateogriesOfFeesService', () => {
  let service: categoriesFeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(categoriesFeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
