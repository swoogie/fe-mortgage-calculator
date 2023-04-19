import { TestBed } from '@angular/core/testing';

import { EuriborService } from './euribor.service';

describe('EuriborService', () => {
  let service: EuriborService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuriborService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
