import { TestBed } from '@angular/core/testing';

import { AdavanceService } from './advance.service';

describe('AdavanceService', () => {
  let service: AdavanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdavanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
