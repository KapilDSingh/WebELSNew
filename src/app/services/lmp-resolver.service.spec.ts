import { TestBed } from '@angular/core/testing';

import { LmpResolverService } from './lmp-resolver.service';

describe('LmpResolverService', () => {
  let service: LmpResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmpResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
