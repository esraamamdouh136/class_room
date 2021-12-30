import { TestBed } from '@angular/core/testing';

import { CopyContentService } from './copy-content.service';

describe('CopyContentService', () => {
  let service: CopyContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopyContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
