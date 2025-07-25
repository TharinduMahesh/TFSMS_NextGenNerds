import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CEditComponent } from './c-edit.component';

describe('CEditComponent', () => {
  let component: CEditComponent;
  let fixture: ComponentFixture<CEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
