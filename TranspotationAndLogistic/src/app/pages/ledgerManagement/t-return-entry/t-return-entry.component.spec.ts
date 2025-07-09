import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TReturnEntryComponent } from './t-return-entry.component';

describe('TReturnEntryComponent', () => {
  let component: TReturnEntryComponent;
  let fixture: ComponentFixture<TReturnEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TReturnEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TReturnEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
