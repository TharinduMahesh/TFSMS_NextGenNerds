import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenaturedTeaEntryComponent } from './denatured-tea-entry.component';

describe('DenaturedTeaEntryComponent', () => {
  let component: DenaturedTeaEntryComponent;
  let fixture: ComponentFixture<DenaturedTeaEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenaturedTeaEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenaturedTeaEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
