import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTotalPaymentsComponent } from './supplier-total-payments.component';

describe('SupplierTotalPaymentsComponent', () => {
  let component: SupplierTotalPaymentsComponent;
  let fixture: ComponentFixture<SupplierTotalPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierTotalPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierTotalPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
