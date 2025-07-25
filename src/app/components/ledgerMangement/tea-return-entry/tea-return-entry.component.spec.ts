import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaReturnEntryComponent } from './tea-return-entry.component';

describe('TeaReturnEntryComponent', () => {
  let component: TeaReturnEntryComponent;
  let fixture: ComponentFixture<TeaReturnEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeaReturnEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeaReturnEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
