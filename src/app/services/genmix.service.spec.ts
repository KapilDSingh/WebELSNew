import { TestBed } from '@angular/core/testing';

import { GenmixService } from './genmix.service';

describe('GenmixService', () => {
  let service: GenmixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenmixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
