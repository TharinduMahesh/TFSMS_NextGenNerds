import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VEditComponent } from './v-edit.component';

describe('VEditComponent', () => {
  let component: VEditComponent;
  let fixture: ComponentFixture<VEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
