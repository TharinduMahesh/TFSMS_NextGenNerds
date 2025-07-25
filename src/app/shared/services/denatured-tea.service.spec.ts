import { TestBed } from '@angular/core/testing';

import { DenaturedTeaService } from './denatured-tea.service';

describe('DenaturedTeaService', () => {
  let service: DenaturedTeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenaturedTeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
