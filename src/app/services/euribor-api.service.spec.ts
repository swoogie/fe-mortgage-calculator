import { TestBed } from '@angular/core/testing';

import { EuriborApiService } from './euribor-api.service';

describe('EuriborApiService', () => {
  let service: EuriborApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuriborApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
