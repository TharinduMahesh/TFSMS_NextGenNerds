import { TestBed } from '@angular/core/testing';

import { PaymentAutoFillService } from './payment-auto-fill.service';

describe('PaymentAutoFillService', () => {
  let service: PaymentAutoFillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentAutoFillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
