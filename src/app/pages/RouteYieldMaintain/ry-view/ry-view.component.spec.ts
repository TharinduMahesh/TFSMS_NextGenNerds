import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RyviewComponent } from './ry-view.component';

describe('RyviewComponent', () => {
  let component: RyviewComponent;
  let fixture: ComponentFixture<RyviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RyviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RyviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
