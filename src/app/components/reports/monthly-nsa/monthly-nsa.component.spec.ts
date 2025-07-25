import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyNsaComponent } from './monthly-nsa.component';

describe('MonthlyNsaComponent', () => {
  let component: MonthlyNsaComponent;
  let fixture: ComponentFixture<MonthlyNsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyNsaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyNsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
