import { TestBed } from '@angular/core/testing';

import { FmsubService } from './fmsub.service';

describe('FmsubService', () => {
  let service: FmsubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FmsubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
