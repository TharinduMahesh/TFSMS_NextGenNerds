import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RyeditComponent } from './ryedit.component';

describe('RyeditComponent', () => {
  let component: RyeditComponent;
  let fixture: ComponentFixture<RyeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RyeditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RyeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
