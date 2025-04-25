import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RFormComponent } from './r-create.component';

describe('RFormComponent', () => {
  let component: RFormComponent;
  let fixture: ComponentFixture<RFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
