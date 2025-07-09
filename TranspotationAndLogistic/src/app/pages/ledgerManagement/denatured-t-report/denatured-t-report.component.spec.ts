import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenaturedTReportComponent } from './denatured-t-report.component';

describe('DenaturedTReportComponent', () => {
  let component: DenaturedTReportComponent;
  let fixture: ComponentFixture<DenaturedTReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenaturedTReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenaturedTReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
