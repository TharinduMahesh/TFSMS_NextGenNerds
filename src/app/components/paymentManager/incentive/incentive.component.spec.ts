import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveComponent } from './incentive.component';

describe('IncentiveComponent', () => {
  let component: IncentiveComponent;
  let fixture: ComponentFixture<IncentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
