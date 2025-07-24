import { TestBed } from '@angular/core/testing';

import { GreenLeafService } from './green-leaf.service';

describe('GreenLeafService', () => {
  let service: GreenLeafService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreenLeafService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
