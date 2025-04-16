import { TestBed } from '@angular/core/testing';

import { YieldlistService } from './yieldlist.service';

describe('YieldlistService', () => {
  let service: YieldlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YieldlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
