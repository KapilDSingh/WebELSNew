import { TestBed } from '@angular/core/testing';

import { MeterResolverService } from './meter-resolver.service';

describe('MeterResolverService', () => {
  let service: MeterResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeterResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
