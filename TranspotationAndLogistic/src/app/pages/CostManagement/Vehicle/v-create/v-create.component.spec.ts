import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VCreateComponent } from './v-create.component';

describe('VCreateComponent', () => {
  let component: VCreateComponent;
  let fixture: ComponentFixture<VCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
