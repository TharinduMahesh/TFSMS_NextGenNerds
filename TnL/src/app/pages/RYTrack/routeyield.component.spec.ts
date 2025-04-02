import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouetyieldComponent } from './rouetyield.component';

describe('RouetyieldComponent', () => {
  let component: RouetyieldComponent;
  let fixture: ComponentFixture<RouetyieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouetyieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouetyieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
