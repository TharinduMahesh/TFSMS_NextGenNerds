import { TestBed } from '@angular/core/testing';

import { SupplierTotalPaymentRecordService } from './supplier-total-payment-record.service';

describe('SupplierTotalPaymentRecordService', () => {
  let service: SupplierTotalPaymentRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierTotalPaymentRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
