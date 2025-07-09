import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchViewComponent } from './dispatch-view.component';

describe('DispatchViewComponent', () => {
  let component: DispatchViewComponent;
  let fixture: ComponentFixture<DispatchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
