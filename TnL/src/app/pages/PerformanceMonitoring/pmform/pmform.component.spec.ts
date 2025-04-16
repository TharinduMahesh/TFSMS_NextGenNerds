import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmformComponent } from './pmform.component';

describe('PmformComponent', () => {
  let component: PmformComponent;
  let fixture: ComponentFixture<PmformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
