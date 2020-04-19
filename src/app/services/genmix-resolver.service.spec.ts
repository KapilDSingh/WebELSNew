import { TestBed } from '@angular/core/testing';

import { GenmixResolverService } from './genmix-resolver.service';

describe('GenmixResolverService', () => {
  let service: GenmixResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenmixResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
