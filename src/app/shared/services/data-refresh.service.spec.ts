import { TestBed } from '@angular/core/testing';

import { DataRefreshService } from './data-refresh.service';

describe('DataRefreshService', () => {
  let service: DataRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
