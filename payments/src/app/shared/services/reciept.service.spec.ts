import { TestBed } from '@angular/core/testing';

import { RecieptService } from './reciept.service';

describe('RecieptService', () => {
  let service: RecieptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecieptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
