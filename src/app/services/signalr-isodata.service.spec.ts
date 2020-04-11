import { TestBed } from '@angular/core/testing';

import { SignalrISOdataService } from './signalr-isodata.service';

describe('SignalrISOdataService', () => {
  let service: SignalrISOdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrISOdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
