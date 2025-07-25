import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentManagmentComponent } from './payment-managment.component';

describe('PaymentManagmentComponent', () => {
  let component: PaymentManagmentComponent;
  let fixture: ComponentFixture<PaymentManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
