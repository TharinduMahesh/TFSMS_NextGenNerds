import { ComponentFixture, TestBed } from '@angular/core/testing';

import { REditComponent } from './r-edit.component';

describe('REditComponent', () => {
  let component: REditComponent;
  let fixture: ComponentFixture<REditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [REditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(REditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
