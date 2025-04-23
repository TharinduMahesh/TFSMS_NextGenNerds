import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaPackingAndLedgerComponent } from './tea-packing-and-ledger.component';

describe('TeaPackingAndLedgerComponent', () => {
  let component: TeaPackingAndLedgerComponent;
  let fixture: ComponentFixture<TeaPackingAndLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeaPackingAndLedgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeaPackingAndLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
