import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCreateComponent } from './c-create.component';

describe('CCreateComponent', () => {
  let component: CCreateComponent;
  let fixture: ComponentFixture<CCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
