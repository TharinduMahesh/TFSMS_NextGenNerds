import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMformComponent } from './cmform.component';

describe('CMformComponent', () => {
  let component: CMformComponent;
  let fixture: ComponentFixture<CMformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CMformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CMformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
