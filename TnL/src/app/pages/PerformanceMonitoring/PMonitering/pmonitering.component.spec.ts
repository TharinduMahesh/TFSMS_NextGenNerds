import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmComponent } from './pmonitering.component';

describe('PfmComponent', () => {
  let component: PfmComponent;
  let fixture: ComponentFixture<PfmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PfmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
