import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenaturedTEntryComponent } from './denatured-t-entry.component';

describe('DenaturedTEntryComponent', () => {
  let component: DenaturedTEntryComponent;
  let fixture: ComponentFixture<DenaturedTEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenaturedTEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenaturedTEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
