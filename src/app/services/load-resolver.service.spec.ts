import { TestBed } from '@angular/core/testing';

import { LoadResolverService } from './load-resolver.service';

describe('LoadResolverService', () => {
  let service: LoadResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
