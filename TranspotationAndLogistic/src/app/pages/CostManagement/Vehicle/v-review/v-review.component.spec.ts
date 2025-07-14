import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VReviewComponent } from './v-review.component';

describe('VReviewComponent', () => {
  let component: VReviewComponent;
  let fixture: ComponentFixture<VReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
