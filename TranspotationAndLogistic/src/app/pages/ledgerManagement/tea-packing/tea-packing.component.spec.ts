import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaPackingComponent } from './tea-packing.component';

describe('TeaPackingComponent', () => {
  let component: TeaPackingComponent;
  let fixture: ComponentFixture<TeaPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeaPackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeaPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
