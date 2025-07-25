import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerDashboardComponent } from './ledger-dashboard.component';

describe('LedgerDashboardComponent', () => {
  let component: LedgerDashboardComponent;
  let fixture: ComponentFixture<LedgerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
