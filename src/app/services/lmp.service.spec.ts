import { TestBed } from '@angular/core/testing';

import { LmpService } from './lmp.service';

describe('LmpService', () => {
  let service: LmpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
