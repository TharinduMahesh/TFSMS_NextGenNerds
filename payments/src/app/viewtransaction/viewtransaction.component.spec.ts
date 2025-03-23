import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtransactionComponent } from './viewtransaction.component';

describe('ViewtransactionComponent', () => {
  let component: ViewtransactionComponent;
  let fixture: ComponentFixture<ViewtransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewtransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
