import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchRegisComponent } from './dispatch-regis.component';

describe('DispatchRegisComponent', () => {
  let component: DispatchRegisComponent;
  let fixture: ComponentFixture<DispatchRegisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchRegisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchRegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
