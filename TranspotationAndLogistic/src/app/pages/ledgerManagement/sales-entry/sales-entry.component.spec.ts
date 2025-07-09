import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaryEntryComponent } from './sales-entry.component';

describe('SlaryEntryComponent', () => {
  let component: SlaryEntryComponent;
  let fixture: ComponentFixture<SlaryEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaryEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlaryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
